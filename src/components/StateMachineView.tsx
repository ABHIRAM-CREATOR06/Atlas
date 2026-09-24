import { evaluateStateMachine } from "../lib/replay";
import type { ProtocolDefinition, TraceEvent } from "../types";

type StateMachineViewProps = {
	protocol: ProtocolDefinition;
	events: TraceEvent[];
	selectedEvent?: TraceEvent;
};

export function StateMachineView({ protocol, events, selectedEvent }: StateMachineViewProps) {
	const currentT = selectedEvent?.t ?? 0;
	const smEval = evaluateStateMachine(protocol, events, currentT);
	const transitions = protocol.transitions || [];

	const stateNodes = smEval.allStates;
	const activeState = smEval.currentState;

	const traversedSet = new Set(
		smEval.traversedTransitions.map((t) => `${t.from}->${t.to}`)
	);

	return (
		<article className="card visual">
			<div className="panel-heading">
				<div>
					<p className="eyebrow">State machine view</p>
					<h3>Protocol lifecycle FSM (Event-Driven)</h3>
					<p>Finite state machine topology, active state at t={currentT}, and traversed transition paths.</p>
				</div>
				<div className="active-state-badge">
					<span>Active State: </span>
					<strong className="mono status active" style={{ marginLeft: 6 }}>{activeState}</strong>
				</div>
			</div>

			{smEval.illegalTransitions.length > 0 && (
				<div className="error-strip" style={{ margin: "12px 20px" }}>
					<strong>State Machine Diagnostics ({smEval.illegalTransitions.length})</strong>
					<ul>
						{smEval.illegalTransitions.map((ill, i) => (
							<li key={i}>
								t={ill.t}: {ill.reason}
							</li>
						))}
					</ul>
				</div>
			)}

			<div className="machine-wrapper">
				<div className="machine-flow" style={{ flexWrap: "wrap", gap: "16px" }}>
					{transitions.length > 0 ? (
						transitions.map((trans, idx) => {
							const isTraversed = traversedSet.has(`${trans.from}->${trans.to}`);
							const isFromActive = activeState === trans.from;
							const isToActive = activeState === trans.to;

							return (
								<div key={`${trans.from}-${trans.to}-${idx}`} className="machine-step">
									<span
										className={`node ${isFromActive ? "active" : ""} ${trans.isError ? "error" : ""}`}
									>
										{trans.from}
									</span>
									<div className={`transition-link ${isTraversed ? "traversed" : ""}`}>
										<span className="arrow">{isTraversed ? "➔" : "→"}</span>
										<span className="transition-label" title={trans.description || trans.event}>
											{trans.label || trans.event}
										</span>
									</div>
									{idx === transitions.length - 1 && (
										<span
											className={`node ${isToActive ? "active" : ""} ${trans.isTerminal ? "terminal" : ""}`}
										>
											{trans.to}
										</span>
									)}
								</div>
							);
						})
					) : (
						<div className="machine-nodes-grid" style={{ display: "flex", gap: "12px" }}>
							{stateNodes.map((st) => (
								<span key={st} className={`node ${st === activeState ? "active" : ""}`}>
									{st}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
		</article>
	);
}

