import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { DependencyGraph } from "./components/DependencyGraph";
import { GuidedWalkthrough } from "./components/GuidedWalkthrough";
import { Header } from "./components/Header";
import { ImportExportModal } from "./components/ImportExportModal";
import { Inspector } from "./components/Inspector";
import { ProtocolSummary } from "./components/ProtocolSummary";
import { SequenceDiagram } from "./components/SequenceDiagram";
import { StateMachineView } from "./components/StateMachineView";
import { StateTimeline } from "./components/StateTimeline";
import { ThreatOverlay } from "./components/ThreatOverlay";
import { Toolbar } from "./components/Toolbar";

import { protocols } from "./data/protocols";
import { scenarios } from "./data/scenarios";
import { traces } from "./data/traces";
import { walkthroughs } from "./data/walkthroughs";

import { isSequenceEvent, parseTrace } from "./lib/trace";
import type { ProtocolDefinition, TraceEvent, ViewId } from "./types";

export function App() {
	const [protocolId, setProtocolId] = useState(protocols[0].id);
	const [customTraceJsonl, setCustomTraceJsonl] = useState<string | null>(null);
	const [activeView, setActiveView] = useState<ViewId>("sequenceDiagram");
	const [selectedEvent, setSelectedEvent] = useState<TraceEvent | undefined>();

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedActor, setSelectedActor] = useState("all");
	const [selectedPhase, setSelectedPhase] = useState("all");
	const [selectedScenarioId, setSelectedScenarioId] = useState("none");

	const [modalMode, setModalMode] = useState<"import" | "export" | null>(null);

	const protocol = useMemo(
		() => protocols.find((item) => item.id === protocolId) ?? protocols[0],
		[protocolId]
	);

	const rawTrace = customTraceJsonl ?? traces[protocol.id] ?? "";
	const validation = useMemo(() => parseTrace(rawTrace, protocol), [rawTrace, protocol]);

	const protocolScenarios = scenarios[protocol.id] || [];
	const activeScenario = protocolScenarios.find((s) => s.id === selectedScenarioId);

	// Filter events based on toolbar search, actor, phase
	const filteredEvents = useMemo(() => {
		return validation.events.filter((evt) => {
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
	}, [validation.events, selectedActor, selectedPhase, searchQuery]);

	const firstEvent =
		filteredEvents.find((evt) => isSequenceEvent(protocol, evt)) ?? filteredEvents[0];
	const currentEvent =
		selectedEvent && filteredEvents.some((evt) => evt.t === selectedEvent.t || evt.id === selectedEvent.id)
			? selectedEvent
			: firstEvent;

	function handleSelectProtocol(nextId: string) {
		const nextProto = protocols.find((item) => item.id === nextId) ?? protocols[0];
		setProtocolId(nextProto.id);
		setCustomTraceJsonl(null);
		setActiveView(nextProto.views[0]);
		setSelectedEvent(undefined);
		setSelectedScenarioId("none");
		setSearchQuery("");
		setSelectedActor("all");
		setSelectedPhase("all");
	}

	function handleImportSuccess(protoDef?: ProtocolDefinition, traceJsonl?: string) {
		if (traceJsonl) {
			setCustomTraceJsonl(traceJsonl);
			setSelectedEvent(undefined);
		}
	}

	return (
		<main className="app">
			<Header
				protocols={protocols}
				selectedId={protocol.id}
				onSelectProtocol={handleSelectProtocol}
				onOpenImport={() => setModalMode("import")}
				onOpenExport={() => setModalMode("export")}
			/>

			<ProtocolSummary protocol={protocol} events={filteredEvents} diagnostics={validation.diagnostics} />

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
							events={filteredEvents}
							selectedEvent={currentEvent}
							onSelect={setSelectedEvent}
						/>
					)}

					{activeView === "stateTimeline" && (
						<StateTimeline
							protocol={protocol}
							events={filteredEvents}
							selectedEvent={currentEvent}
							onSelect={setSelectedEvent}
						/>
					)}

					{activeView === "stateMachine" && (
						<StateMachineView
							protocol={protocol}
							events={filteredEvents}
							selectedEvent={currentEvent}
						/>
					)}

					{activeView === "dependencyGraph" && (
						<DependencyGraph
							events={filteredEvents}
							compromisedRefs={activeScenario?.affectedEvents || []}
							onSelectEvent={setSelectedEvent}
						/>
					)}

					{activeView === "guidedWalkthrough" && (
						<GuidedWalkthrough
							walkthrough={walkthroughs[protocol.id]}
							onStepSelect={(t) => {
								if (t !== undefined) {
									const matchingEvt = filteredEvents.find((e) => e.t === t);
									if (matchingEvt) setSelectedEvent(matchingEvt);
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
					<strong>Atlas</strong> · Minimal professional protocol explanation interface
				</span>
				<span>Light theme · Accessible by default · Local-first</span>
			</footer>
		</main>
	);
}
