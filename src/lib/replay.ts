import type { ProtocolDefinition, TraceEvent } from "../types";

export type ReplayState = {
	t: number;
	activePhase?: string;
	currentStateByActor: Record<string, Record<string, string>>;
	derivedValues: Record<string, string>;
	actorStates: Record<string, string>;
	activeEvent?: TraceEvent;
	eventStates: Record<string, "completed" | "active" | "future">;
	cumulativeEvents: TraceEvent[];
};

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
						currentStateByActor[evt.actor][k] = v;
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

	return {
		t: currentTime,
		activePhase,
		currentStateByActor,
		derivedValues,
		actorStates,
		activeEvent,
		eventStates,
		cumulativeEvents,
	};
}
