import type { ProtocolDefinition, TraceEvent, TransitionDefinition } from "../types";

export type TraversedTransition = {
	from: string;
	to: string;
	event: string;
	t: number;
	actor?: string;
	isError?: boolean;
	isTerminal?: boolean;
};

export type StateMachineEvaluation = {
	currentState: string;
	allStates: string[];
	traversedTransitions: TraversedTransition[];
	illegalTransitions: { eventId: string; t: number; event: string; fromState: string; reason: string }[];
};

export type ReplayState = {
	t: number;
	activePhase?: string;
	currentStateByActor: Record<string, Record<string, string>>;
	derivedValues: Record<string, string>;
	actorStates: Record<string, string>;
	activeEvent?: TraceEvent;
	eventStates: Record<string, "completed" | "active" | "future">;
	cumulativeEvents: TraceEvent[];
	stateMachine: StateMachineEvaluation;
};

export function evaluateStateMachine(
	protocol: ProtocolDefinition,
	events: TraceEvent[],
	currentTime: number
): StateMachineEvaluation {
	const transitions = protocol.transitions || [];
	const stateSet = new Set<string>();

	transitions.forEach((tr: TransitionDefinition) => {
		if (tr.from) stateSet.add(tr.from);
		if (tr.to) stateSet.add(tr.to);
	});

	if (stateSet.size === 0) {
		stateSet.add("START");
		stateSet.add("CONNECTED");
	}


	const initialState = transitions[0]?.from || Array.from(stateSet)[0] || "IDLE";
	let currentState = initialState;
	const traversedTransitions: TraversedTransition[] = [];
	const illegalTransitions: StateMachineEvaluation["illegalTransitions"] = [];

	events.forEach((evt) => {
		if (evt.t <= currentTime) {
			// Find matching transition from current state first
			const directMatch = transitions.find(
				(tr) => tr.from === currentState && (tr.event === evt.event || tr.label === evt.event || tr.label === evt.label)
			);

			if (directMatch) {
				currentState = directMatch.to;
				traversedTransitions.push({
					from: directMatch.from,
					to: directMatch.to,
					event: evt.event,
					t: evt.t,
					actor: evt.actor,
					isError: directMatch.isError,
					isTerminal: directMatch.isTerminal,
				});
			} else {
				// Check if event matches ANY transition in the protocol definition from another state
				const anyMatch = transitions.find((tr) => tr.event === evt.event || tr.label === evt.event || tr.label === evt.label);
				if (anyMatch) {
					// Event was declared in protocol FSM but occurred when state machine was at a different state
					illegalTransitions.push({
						eventId: evt.id,
						t: evt.t,
						event: evt.event,
						fromState: currentState,
						reason: `Event "${evt.event}" cannot transition from state "${currentState}". Expected state "${anyMatch.from}".`,
					});
					// If specified as error transition or explicit jump, we still update if it's an error transition
					if (anyMatch.isError) {
						currentState = anyMatch.to;
						traversedTransitions.push({
							from: anyMatch.from,
							to: anyMatch.to,
							event: evt.event,
							t: evt.t,
							actor: evt.actor,
							isError: true,
						});
					}
				}
			}

			// If event explicitly declares a state change in evt.state or evt.label (when kind === "state")
			if (evt.kind === "state" && evt.label && stateSet.has(evt.label)) {
				currentState = evt.label;
			}
		}
	});

	return {
		currentState,
		allStates: Array.from(stateSet),
		traversedTransitions,
		illegalTransitions,
	};
}

export function computeReplayState(
	events: TraceEvent[],
	protocol: ProtocolDefinition,
	currentTime: number
): ReplayState {
	const currentStateByActor: Record<string, Record<string, string>> = {};
	const derivedValues: Record<string, string> = {};
	const actorStates: Record<string, string> = {};
	const eventStates: Record<string, "completed" | "active" | "future"> = {};
	let activePhase: string | undefined = protocol.phases?.[0]?.id;
	let activeEvent: TraceEvent | undefined = undefined;
	const cumulativeEvents: TraceEvent[] = [];

	// Initialize default actor states
	protocol.actors.forEach((actor) => {
		currentStateByActor[actor.id] = {};
		actorStates[actor.id] = "IDLE";
	});

	// Initialize state variables from protocol defaults
	(protocol.stateVariables || []).forEach((sv) => {
		if (sv.owner && currentStateByActor[sv.owner]) {
			currentStateByActor[sv.owner][sv.id] = "initialized";
		}
	});

	// Replay up to currentTime
	events.forEach((evt) => {
		if (evt.t <= currentTime) {
			cumulativeEvents.push(evt);

			if (evt.phase) {
				activePhase = evt.phase;
			}

			if (evt.t === currentTime) {
				activeEvent = evt;
				eventStates[evt.id] = "active";
			} else {
				eventStates[evt.id] = "completed";
			}

			// Update state variables for actor
			if (evt.actor) {
				if (!currentStateByActor[evt.actor]) {
					currentStateByActor[evt.actor] = {};
				}
				if (evt.state) {
					Object.entries(evt.state).forEach(([k, v]) => {
						currentStateByActor[evt.actor][k] = String(v);
					});
				}
			}

			// Track derived output references
			const outRef = evt.outputRef || evt.output_ref || (evt.metadata?.outputRef as string);
			if (outRef) {
				derivedValues[outRef] = `t=${evt.t} by ${evt.actor}`;
			}

			// Update high-level actor state machine position if indicated
			if (evt.kind === "state" && evt.label) {
				actorStates[evt.actor] = evt.label;
			} else if (evt.event.includes("SYN_SENT") || evt.event.includes("Connect")) {
				actorStates[evt.actor] = "CONNECTING";
			} else if (evt.event.includes("ESTABLISHED") || evt.event.includes("Handshake")) {
				actorStates[evt.actor] = "ESTABLISHED";
			}
		} else {
			eventStates[evt.id] = "future";
		}
	});

	const stateMachine = evaluateStateMachine(protocol, events, currentTime);

	return {
		t: currentTime,
		activePhase,
		currentStateByActor,
		derivedValues,
		actorStates,
		activeEvent,
		eventStates,
		cumulativeEvents,
		stateMachine,
	};
}

