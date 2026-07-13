import type { ProtocolDefinition, TraceEvent, ValidationResult } from "../types";

export function parseTrace(jsonl: string, protocol: ProtocolDefinition): ValidationResult {
	const errors: string[] = [];
	const actorIds = new Set(protocol.actors.map((actor) => actor.id));
	const eventIds = new Set([...Object.keys(protocol.operationTypes), ...Object.keys(protocol.stepTypes)]);
	const events = jsonl
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line, index) => {
			try {
				return JSON.parse(line) as TraceEvent;
			} catch {
				errors.push(`Line ${index + 1}: invalid JSON.`);
				return null;
			}
		})
		.filter((event): event is TraceEvent => event !== null)
		.sort((a, b) => a.t - b.t);

	events.forEach((event, index) => {
		if (!Number.isInteger(event.t)) {
			errors.push(`Line ${index + 1}: "t" must be an integer logical timestamp.`);
		}

		if (!actorIds.has(event.actor)) {
			errors.push(`t=${event.t}: actor "${event.actor}" is not declared by ${protocol.name}.`);
		}

		if (!eventIds.has(event.event)) {
			errors.push(`t=${event.t}: event "${event.event}" is not declared by ${protocol.name}.`);
		}
	});

	return { events, errors };
}

export function isSequenceEvent(protocol: ProtocolDefinition, event: TraceEvent) {
	return protocol.operationTypes[event.event] !== undefined;
}

export function isTimelineEvent(protocol: ProtocolDefinition, event: TraceEvent) {
	return protocol.stepTypes[event.event] !== undefined;
}

export function displayValue(value: unknown) {
	if (Array.isArray(value)) {
		return value.join(", ");
	}

	if (value === undefined || value === null || value === "") {
		return "none";
	}

	if (typeof value === "object") {
		return JSON.stringify(value);
	}

	return String(value);
}
