import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { ComparisonMode } from "./components/ComparisonMode";
import { DependencyGraph } from "./components/DependencyGraph";
import { GuidedWalkthrough } from "./components/GuidedWalkthrough";
import { Header } from "./components/Header";
import { ImportExportModal } from "./components/ImportExportModal";
import { Inspector } from "./components/Inspector";
import { ProtocolCatalog } from "./components/ProtocolCatalog";
import { ProtocolSummary } from "./components/ProtocolSummary";
import { SequenceDiagram } from "./components/SequenceDiagram";
import { StateMachineView } from "./components/StateMachineView";
import { StateTimeline } from "./components/StateTimeline";
import { ThreatOverlay } from "./components/ThreatOverlay";
import { Toolbar } from "./components/Toolbar";

import { protocols as bundledProtocols } from "./data/protocols";
import { scenarios } from "./data/scenarios";
import { traces } from "./data/traces";
import { walkthroughs } from "./data/walkthroughs";

import { isSequenceEvent, parseTrace } from "./lib/trace";
import type { ProtocolDefinition, TraceEvent, ViewId } from "./types";

export function App() {
	const [appMode, setAppMode] = useState<"workspace" | "catalog" | "compare">("workspace");
	const [customProtocols, setCustomProtocols] = useState<ProtocolDefinition[]>([]);
	const [protocolId, setProtocolId] = useState(bundledProtocols[0].id);
	const [compareTargetId, setCompareTargetId] = useState<string | undefined>();
	const [customTraceJsonl, setCustomTraceJsonl] = useState<string | null>(null);
	const [activeView, setActiveView] = useState<ViewId>("sequenceDiagram");

	const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedActor, setSelectedActor] = useState("all");
	const [selectedPhase, setSelectedPhase] = useState("all");
	const [selectedScenarioId, setSelectedScenarioId] = useState("none");

	const [modalMode, setModalMode] = useState<"import" | "export" | null>(null);

	const allProtocols = useMemo(
		() => [...bundledProtocols, ...customProtocols],
		[customProtocols]
	);

	const protocol = useMemo(
		() => allProtocols.find((item) => item.id === protocolId) ?? allProtocols[0],
		[allProtocols, protocolId]
	);

	const rawTrace = customTraceJsonl ?? traces[protocol.id] ?? "";

	// canonicalEvents: all parsed and validated events in deterministic trace order
	const validation = useMemo(() => parseTrace(rawTrace, protocol), [rawTrace, protocol]);
	const canonicalEvents = validation.events;

	const protocolScenarios = scenarios[protocol.id] || [];
	const activeScenario = protocolScenarios.find((s) => s.id === selectedScenarioId);

	// visibleEvents: presentation-filtered subset according to toolbar controls
	const visibleEvents = useMemo(() => {
		return canonicalEvents.filter((evt) => {
			if (selectedActor !== "all" && evt.actor !== selectedActor && evt.from !== selectedActor && evt.to !== selectedActor) {
				return false;
			}
			if (selectedPhase !== "all" && evt.phase !== selectedPhase) {
				return false;
			}
			if (searchQuery.trim() !== "") {
				const q = searchQuery.toLowerCase();
				const matchLabel = (evt.label || "").toLowerCase().includes(q);
				const matchEvent = (evt.event || "").toLowerCase().includes(q);
				const matchActor = (evt.actor || "").toLowerCase().includes(q);
				if (!matchLabel && !matchEvent && !matchActor) {
					return false;
				}
			}
			return true;
		});
	}, [canonicalEvents, selectedActor, selectedPhase, searchQuery]);

	const firstEvent =
		visibleEvents.find((evt) => isSequenceEvent(protocol, evt)) ?? visibleEvents[0] ?? canonicalEvents[0];

	const currentEvent = useMemo(() => {
		if (selectedEventId) {
			const matched = canonicalEvents.find((e) => e.id === selectedEventId);
			if (matched) return matched;
		}
		return firstEvent;
	}, [selectedEventId, canonicalEvents, firstEvent]);

	function handleSelectEvent(evt?: TraceEvent) {
		if (evt) {
			setSelectedEventId(evt.id);
		} else {
			setSelectedEventId(null);
		}
	}

	function handleSelectProtocol(nextId: string) {
		const nextProto = allProtocols.find((item) => item.id === nextId) ?? allProtocols[0];
		setProtocolId(nextProto.id);
		setCustomTraceJsonl(null);
		setActiveView(nextProto.views[0]);
		setSelectedEventId(null);
		setSelectedScenarioId("none");
		setSearchQuery("");
		setSelectedActor("all");
		setSelectedPhase("all");
		setAppMode("workspace");
	}

	function handleOpenCompare(protoId?: string) {
		if (protoId) setCompareTargetId(protoId);
		setAppMode("compare");
	}

	function handleImportSuccess(protoDef?: ProtocolDefinition, traceJsonl?: string) {
		if (protoDef) {
			setCustomProtocols((prev) => {
				const filtered = prev.filter((p) => p.id !== protoDef.id);
				return [...filtered, protoDef];
			});
			setProtocolId(protoDef.id);
			if (traceJsonl) setCustomTraceJsonl(traceJsonl);
			else setCustomTraceJsonl(null);
			setSelectedEventId(null);
			setAppMode("workspace");
		} else if (traceJsonl) {
			setCustomTraceJsonl(traceJsonl);
			setSelectedEventId(null);
			setAppMode("workspace");
		}
	}

	return (
		<main className="app">
			<Header
				protocols={allProtocols}
				selectedId={protocol.id}
				onSelectProtocol={handleSelectProtocol}
				onOpenCatalog={() => setAppMode("catalog")}
				onOpenCompare={() => handleOpenCompare()}
				onOpenImport={() => setModalMode("import")}
				onOpenExport={() => setModalMode("export")}
			/>

			{appMode === "catalog" && (
				<ProtocolCatalog
					protocols={allProtocols}
					onSelectProtocol={handleSelectProtocol}
					onSelectCompare={handleOpenCompare}
				/>
			)}

			{appMode === "compare" && (
				<ComparisonMode
					protocols={allProtocols}
					initialProtoAId={compareTargetId || protocol.id}
					onClose={() => setAppMode("catalog")}
					onSelectProtocol={handleSelectProtocol}
				/>
			)}

			{appMode === "workspace" && (
				<>
					<ProtocolSummary protocol={protocol} events={canonicalEvents} diagnostics={validation.diagnostics} />

					{validation.errors.length > 0 && (
						<section className="error-strip">
							<AlertTriangle size={18} />
							<div>
								<strong>Trace verification diagnostics</strong>
								<p>{validation.errors.join(" | ")}</p>
							</div>
						</section>
					)}

					<Toolbar
						protocol={protocol}
						activeView={activeView}
						onSelectView={setActiveView}
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						selectedActor={selectedActor}
						onSelectActor={setSelectedActor}
						selectedPhase={selectedPhase}
						onSelectPhase={setSelectedPhase}
						scenariosList={protocolScenarios}
						selectedScenarioId={selectedScenarioId}
						onSelectScenario={setSelectedScenarioId}
					/>

					<ThreatOverlay scenario={activeScenario} />

					<div className="workspace">
						<div className="main-visual-column">
							{activeView === "sequenceDiagram" && (
								<SequenceDiagram
									protocol={protocol}
									events={visibleEvents}
									selectedEvent={currentEvent}
									onSelect={handleSelectEvent}
								/>
							)}

							{activeView === "stateTimeline" && (
								<StateTimeline
									protocol={protocol}
									events={visibleEvents}
									canonicalEvents={canonicalEvents}
									selectedEvent={currentEvent}
									onSelect={handleSelectEvent}
								/>
							)}

							{activeView === "stateMachine" && (
								<StateMachineView
									protocol={protocol}
									events={canonicalEvents}
									selectedEvent={currentEvent}
								/>
							)}

							{activeView === "dependencyGraph" && (
								<DependencyGraph
									events={canonicalEvents}
									compromisedRefs={activeScenario?.compromisedRefs || []}
									affectedEventIds={activeScenario?.affectedEventIds || activeScenario?.affectedEvents || []}
									onSelectEvent={handleSelectEvent}
								/>
							)}

							{activeView === "guidedWalkthrough" && (
								<GuidedWalkthrough
									walkthrough={walkthroughs[protocol.id]}
									onStepSelect={(t, eventId) => {
										if (eventId) {
											const evt = canonicalEvents.find((e) => e.id === eventId);
											if (evt) handleSelectEvent(evt);
										} else if (t !== undefined) {
											const evt = canonicalEvents.find((e) => e.t === t);
											if (evt) handleSelectEvent(evt);
										}
									}}
								/>
							)}
						</div>

						<Inspector
							protocol={protocol}
							event={currentEvent}
							diagnostics={validation.diagnostics}
						/>
					</div>
				</>
			)}

			<ImportExportModal
				mode={modalMode || "import"}
				isOpen={modalMode !== null}
				onClose={() => setModalMode(null)}
				protocol={protocol}
				currentTraceJsonl={rawTrace}
				onImportSuccess={handleImportSuccess}
			/>

			<footer className="footer">
				<span>
					<strong>Atlas Protocol Platform</strong> · {allProtocols.length} Protocol Modules · Replay & Analysis
				</span>
				<span>Light theme · Accessible by default · Local-first</span>
			</footer>
		</main>
	);
}

