import { CircleDot, KeyRound } from "lucide-react";
import type { ProtocolDefinition, TraceEvent } from "../types";
import { displayValue } from "../lib/trace";

type InspectorProps = {
	protocol: ProtocolDefinition;
	event?: TraceEvent;
};

export function Inspector({ protocol, event }: InspectorProps) {
	if (!event) {
		return (
			<aside className="inspector empty">
				<CircleDot size={20} />
				<h2>Inspector</h2>
				<p>Select an arrow or timeline step to inspect declared fields, inputs, and symbolic outputs.</p>
			</aside>
		);
	}

	const definition = protocol.operationTypes[event.event] ?? protocol.stepTypes[event.event];

	return (
		<aside className="inspector">
			<div className="inspector-header">
				<KeyRound size={20} />
				<div>
					<p className="eyebrow">t={event.t}</p>
					<h2>{event.label ?? definition.label}</h2>
				</div>
			</div>
			<div className="field-list">
				<div className="field-row">
					<span>Actor</span>
					<strong>{protocol.actors.find((actor) => actor.id === event.actor)?.label ?? event.actor}</strong>
				</div>
				<div className="field-row">
					<span>Event</span>
					<strong>{definition.label}</strong>
				</div>
				{definition.fields.map((field) => (
					<div className="field-row" key={field.key}>
						<span>{field.label}</span>
						<strong>{displayValue(event[field.key])}</strong>
					</div>
				))}
			</div>
		</aside>
	);
}
