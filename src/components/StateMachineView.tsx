import type { ProtocolDefinition, TraceEvent } from "../types";

type StateMachineViewProps = {
	protocol: ProtocolDefinition;
	events: TraceEvent[];
	selectedEvent?: TraceEvent;
};

export function StateMachineView({ protocol, events, selectedEvent }: StateMachineViewProps) {
	const transitions = protocol.transitions || [];

	// Determine current state based on selected event timestamp
	const currentT = selectedEvent?.t ?? 0;
	let currentState = transitions[0]?.from || "IDLE";

	transitions.forEach((trans) => {
		const matchingEvt = events.find((e) => e.t <= currentT && e.event === trans.event);
		if (matchingEvt) {
			currentState = trans.to;
		}
	});

	return (
		<article className="card visual">
			<div className="panel-heading">
				<div>
					<p className="eyebrow">State machine view</p>
					<h3>Protocol lifecycle FSM</h3>
					<p>Finite state machine nodes and transition triggers for protocol execution.</p>
				</div>
			</div>

			<div className="machine-wrapper">
				<div className="machine-flow">
					{transitions.map((trans, idx) => {
						const isNodeActive = currentState === trans.from || currentState === trans.to;
						return (
							<div key={`${trans.from}-${trans.to}-${idx}`} className="machine-step">
								<span className={`node ${currentState === trans.from ? "active" : ""}`}>{trans.from}</span>
								<div className="transition-link">
									<span className="arrow">→</span>
									<span className="transition-label">{trans.label}</span>
								</div>
								{idx === transitions.length - 1 && (
									<span className={`node ${currentState === trans.to ? "active" : ""}`}>{trans.to}</span>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</article>
	);
}
