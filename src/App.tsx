import { useMemo, useState } from "react";
import { AlertTriangle, Braces, ShieldCheck } from "lucide-react";
import { Inspector } from "./components/Inspector";
import { ProtocolPicker } from "./components/ProtocolPicker";
import { SequenceDiagram } from "./components/SequenceDiagram";
import { StateTimeline } from "./components/StateTimeline";
import { protocols } from "./data/protocols";
import { traces } from "./data/traces";
import { isSequenceEvent, parseTrace } from "./lib/trace";
import type { TraceEvent, ViewId } from "./types";

export function App() {
	const [protocolId, setProtocolId] = useState(protocols[0].id);
	const [activeView, setActiveView] = useState<ViewId>("sequenceDiagram");
	const [selectedEvent, setSelectedEvent] = useState<TraceEvent | undefined>();
	const protocol = protocols.find((item) => item.id === protocolId) ?? protocols[0];
	const validation = useMemo(() => parseTrace(traces[protocol.id], protocol), [protocol]);
	const firstEvent = validation.events.find((event) => isSequenceEvent(protocol, event)) ?? validation.events[0];
	const currentEvent = selectedEvent && validation.events.some((event) => event.t === selectedEvent.t) ? selectedEvent : firstEvent;

	function selectProtocol(nextProtocolId: string) {
		const nextProtocol = protocols.find((item) => item.id === nextProtocolId) ?? protocols[0];
		setProtocolId(nextProtocol.id);
		setActiveView(nextProtocol.views[0]);
		setSelectedEvent(undefined);
	}

	return (
		<main className="app-shell">
			<header className="topbar">
				<div className="brand">
					<div className="brand-mark">
						<ShieldCheck size={22} />
					</div>
					<div>
						<p className="eyebrow">Atlas</p>
						<h1>Protocol replay debugger</h1>
					</div>
				</div>
				<ProtocolPicker protocols={protocols} selectedId={protocol.id} onSelect={selectProtocol} />
			</header>

			<section className="summary-band">
				<div>
					<p className="eyebrow">Static Phase 1 replay</p>
					<h2>{protocol.name}</h2>
					<p>{protocol.description}</p>
				</div>
				<div className="metrics">
					<div>
						<strong>{protocol.actors.length}</strong>
						<span>actors</span>
					</div>
					<div>
						<strong>{validation.events.length}</strong>
						<span>events</span>
					</div>
					<div>
						<strong>{protocol.views.length}</strong>
						<span>views</span>
					</div>
				</div>
			</section>

			{validation.errors.length > 0 && (
				<section className="error-strip">
					<AlertTriangle size={18} />
					<div>
						<strong>Trace validation failed</strong>
						<p>{validation.errors.join(" ")}</p>
					</div>
				</section>
			)}

			<nav className="view-tabs" aria-label="Views">
				{protocol.views.includes("sequenceDiagram") && (
					<button className={activeView === "sequenceDiagram" ? "active" : ""} onClick={() => setActiveView("sequenceDiagram")}>
						<Braces size={16} />
						Sequence
					</button>
				)}
				{protocol.views.includes("stateTimeline") && (
					<button className={activeView === "stateTimeline" ? "active" : ""} onClick={() => setActiveView("stateTimeline")}>
						<ShieldCheck size={16} />
						Timeline
					</button>
				)}
			</nav>

			<div className="workspace">
				{activeView === "sequenceDiagram" ? (
					<SequenceDiagram protocol={protocol} events={validation.events} selectedEvent={currentEvent} onSelect={setSelectedEvent} />
				) : (
					<StateTimeline protocol={protocol} events={validation.events} selectedEvent={currentEvent} onSelect={setSelectedEvent} />
				)}
				<Inspector protocol={protocol} event={currentEvent} />
			</div>
		</main>
	);
}
