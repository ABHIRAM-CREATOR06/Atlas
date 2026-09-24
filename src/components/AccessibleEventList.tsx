import React from "react";
import type { ProtocolDefinition, TraceDiagnostic, TraceEvent } from "../types";

type AccessibleEventListProps = {
	protocol: ProtocolDefinition;
	events: TraceEvent[];
	selectedEvent?: TraceEvent;
	onSelect: (event: TraceEvent) => void;
	diagnostics?: TraceDiagnostic[];
};

export const AccessibleEventList: React.FC<AccessibleEventListProps> = ({
	protocol,
	events,
	selectedEvent,
	onSelect,
	diagnostics = [],
}) => {
	return (
		<div className="accessible-event-list" style={{ marginTop: "1rem" }}>
			<h4 className="sr-only">Trace Event Summary Table</h4>
			<p className="sr-only">
				Synchronized text representation of diagram events for screen reader accessibility.
			</p>
			<table className="sr-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
				<thead>
					<tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
						<th style={{ padding: "0.5rem" }}>t</th>
						<th style={{ padding: "0.5rem" }}>Event</th>
						<th style={{ padding: "0.5rem" }}>Actor</th>
						<th style={{ padding: "0.5rem" }}>Route</th>
						<th style={{ padding: "0.5rem" }}>Phase</th>
						<th style={{ padding: "0.5rem" }}>Action</th>
					</tr>
				</thead>
				<tbody>
					{events.map((evt) => {
						const isSelected = selectedEvent?.id === evt.id || selectedEvent?.t === evt.t;
						const msgDef = protocol.messages?.[evt.event];
						const opDef = protocol.operationTypes?.[evt.event];
						const label = evt.label || msgDef?.label || opDef?.label || evt.event;

						return (
							<tr
								key={evt.id || evt.t}
								style={{
									borderBottom: "1px solid var(--border)",
									backgroundColor: isSelected ? "var(--accent-subtle)" : "transparent",
								}}
							>
								<td style={{ padding: "0.5rem", fontFamily: "monospace" }}>t={evt.t}</td>
								<td style={{ padding: "0.5rem", fontWeight: 600 }}>{label}</td>
								<td style={{ padding: "0.5rem" }}>{evt.actor}</td>
								<td style={{ padding: "0.5rem" }}>
									{evt.from && evt.to ? `${evt.from} ➔ ${evt.to}` : "—"}
								</td>
								<td style={{ padding: "0.5rem" }}>{evt.phase || "—"}</td>
								<td style={{ padding: "0.5rem" }}>
									<button
										className="button quiet"
										style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem" }}
										onClick={() => onSelect(evt)}
										aria-label={`Select event t=${evt.t}: ${label}`}
									>
										Inspect
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
