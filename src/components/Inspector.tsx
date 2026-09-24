import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight, CircleDot, Info, KeyRound, Shield } from "lucide-react";
import type { ProtocolDefinition, TraceDiagnostic, TraceEvent } from "../types";
import { displayValue } from "../lib/trace";

type InspectorProps = {
	protocol: ProtocolDefinition;
	event?: TraceEvent;
	diagnostics?: TraceDiagnostic[];
};

export function Inspector({ protocol, event, diagnostics = [] }: InspectorProps) {
	const [showRaw, setShowRaw] = useState(false);

	if (!event) {
		return (
			<aside className="card inspector" aria-labelledby="inspector-title">
				<div className="inspector-head">
					<div className="event-icon" aria-hidden="true">
						<CircleDot size={18} />
					</div>
					<div>
						<p className="eyebrow">Inspector</p>
						<h3 id="inspector-title">No Event Selected</h3>
					</div>
				</div>
				<p style={{ marginTop: 14, color: "var(--muted)", fontSize: 13 }}>
					Click a message arrow, timeline step, or node to inspect structured parameters, cryptographic operations, and state changes.
				</p>
			</aside>
		);
	}

	const msgDef = protocol.messages?.[event.event];
	const opDef = protocol.operationTypes?.[event.event];
	const stepDef = protocol.stepTypes?.[event.event];

	const explanationText =
		event.explanation?.short ||
		msgDef?.explanation?.short ||
		opDef?.explanation?.short ||
		stepDef?.explanation?.short ||
		`Event "${event.event}" performed by actor "${event.actor}".`;

	const eventDiags = diagnostics.filter((d) => d.t === event.t || d.eventId === event.id);

	const fieldsList = msgDef?.fields || opDef?.fields || stepDef?.fields || [];

	return (
		<aside className="card inspector" aria-labelledby="inspector-title" data-testid="inspector-panel">
			<div className="inspector-head">
				<div className="event-icon" aria-hidden="true">
					<KeyRound size={18} />
				</div>
				<div>
					<p className="eyebrow">t={event.t} · selected event</p>
					<h3 id="inspector-title">{event.label || msgDef?.label || opDef?.label || event.event}</h3>
				</div>
			</div>

			<div className="explanation">{explanationText}</div>

			<dl className="field-list">
				<div className="field">
					<dt>Actor</dt>
					<dd>{protocol.actors.find((a) => a.id === event.actor)?.label || event.actor}</dd>
				</div>
				{event.from && (
					<div className="field">
						<dt>From ➔ To</dt>
						<dd>
							{event.from} ➔ {event.to}
						</dd>
					</div>
				)}
				{event.phase && (
					<div className="field">
						<dt>Phase</dt>
						<dd>{event.phase}</dd>
					</div>
				)}
				{event.inputs && event.inputs.length > 0 && (
					<div className="field">
						<dt>Inputs</dt>
						<dd className="mono ref">{event.inputs.join("\n")}</dd>
					</div>
				)}
				{(event.outputRef || event.output_ref) && (
					<div className="field">
						<dt>Output</dt>
						<dd className="mono ref">{event.outputRef || event.output_ref}</dd>
					</div>
				)}
				{fieldsList.map((f) => (
					<div className="field" key={f.key}>
						<dt>{f.label}</dt>
						<dd className={f.kind === "ref" ? "mono ref" : ""}>{displayValue(event[f.key])}</dd>
					</div>
				))}
			</dl>

			{eventDiags.length > 0 && (
				<div className="diagnostics">
					{eventDiags.map((diag, i) => (
						<div key={i} className={`diagnostic ${diag.severity}`}>
							{diag.severity === "error" || diag.severity === "warning" ? (
								<AlertTriangle size={16} />
							) : (
								<Info size={16} />
							)}
							<div>
								<strong>{diag.code}</strong>
								{diag.message}
								{diag.remediation && <div className="remediation">{diag.remediation}</div>}
							</div>
						</div>
					))}
				</div>
			)}

			<div className="raw-toggle-section">
				<button className="button quiet" onClick={() => setShowRaw(!showRaw)}>
					{showRaw ? <ChevronDown size={14} /> : <ChevronRight size={14} />} Raw Event JSON
				</button>
				{showRaw && <pre className="raw-json-pre">{JSON.stringify(event, null, 2)}</pre>}
			</div>
		</aside>
	);
}
