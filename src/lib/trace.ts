import type { ProtocolDefinition, TraceDiagnostic, TraceEvent, ValidationResult } from "../types";
import { validateTraceEventSchema } from "./schema";

export function parseTrace(jsonl: string, protocol: ProtocolDefinition): ValidationResult {
	const diagnostics: TraceDiagnostic[] = [];
	const rawLines = jsonl.split(/\r?\n/);
	const events: TraceEvent[] = [];

	const actorIds = new Set(protocol.actors.map((a) => a.id));
	const messageTypes = new Set(Object.keys(protocol.messages || {}));
	const operationTypes = new Set(Object.keys(protocol.operationTypes || {}));
	const stepTypes = new Set(Object.keys(protocol.stepTypes || {}));
	const validEventTypes = new Set([...messageTypes, ...operationTypes, ...stepTypes]);
	const validPhases = new Set((protocol.phases || []).map((p) => p.id));

	let lineNumber = 0;
	for (const line of rawLines) {
		lineNumber++;
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) {
			continue;
		}

		try {
			const parsed = JSON.parse(trimmed);
			const { event, diagnostics: schemaDiags } = validateTraceEventSchema(parsed, lineNumber);
			diagnostics.push(...schemaDiags);
			if (event) {
				events.push(event);
			}
		} catch {
			diagnostics.push({
				severity: "error",
				code: "INVALID_JSON_SYNTAX",
				line: lineNumber,
				message: `Line ${lineNumber}: Invalid JSON syntax.`,
				remediation: "Check for missing quotes, trailing commas, or unescaped characters.",
			});
		}
	}

	// Sort events by timestamp t
	events.sort((a, b) => a.t - b.t);

	// Multi-pass trace verification & semantic validation
	const seenEventIds = new Set<string>();
	const seenMessageIds = new Set<string>();
	const producedRefs = new Set<string>();
	const timestampsSeen = new Map<number, string>();

	// Seed state variables as known references if provided
	(protocol.stateVariables || []).forEach((sv) => producedRefs.add(sv.id));

	events.forEach((evt, idx) => {
		const lineNum = idx + 1;

		// 1. Duplicate event ID check
		if (evt.id) {
			if (seenEventIds.has(evt.id)) {
				diagnostics.push({
					severity: "warning",
					code: "DUPLICATE_EVENT_ID",
					eventId: evt.id,
					t: evt.t,
					message: `Duplicate event ID "${evt.id}" observed at t=${evt.t}.`,
					remediation: "Ensure each trace event has a unique event ID.",
				});
			} else {
				seenEventIds.add(evt.id);
			}
		}

		// 2. Duplicate message ID check
		if (evt.messageId) {
			if (seenMessageIds.has(evt.messageId)) {
				diagnostics.push({
					severity: "warning",
					code: "DUPLICATE_MESSAGE_ID",
					eventId: evt.id,
					t: evt.t,
					message: `Duplicate message ID "${evt.messageId}" at t=${evt.t}.`,
					remediation: "Message IDs should uniquely identify messages across network exchanges.",
				});
			} else {
				seenMessageIds.add(evt.messageId);
			}
		}

		// 3. Duplicate timestamp check
		if (timestampsSeen.has(evt.t)) {
			diagnostics.push({
				severity: "info",
				code: "CONCURRENT_TIMESTAMPS",
				t: evt.t,
				eventId: evt.id,
				message: `Multiple events share the timestamp t=${evt.t}.`,
				remediation: "Ensure sub-second ordering or logical sequencing is clear.",
			});
		} else {
			timestampsSeen.set(evt.t, evt.id);
		}

		// 4. Actor declaration check
		if (!actorIds.has(evt.actor)) {
			diagnostics.push({
				severity: "error",
				code: "UNKNOWN_ACTOR",
				t: evt.t,
				eventId: evt.id,
				field: "actor",
				message: `Actor "${evt.actor}" at t=${evt.t} is not declared in protocol "${protocol.name}".`,
				remediation: `Declare actor "${evt.actor}" in protocol definition actors list.`,
			});
		}

		// 5. From/To route check
		if (evt.from && !actorIds.has(evt.from)) {
			diagnostics.push({
				severity: "error",
				code: "UNKNOWN_SOURCE_ACTOR",
				t: evt.t,
				eventId: evt.id,
				field: "from",
				message: `Source actor "from": "${evt.from}" is not declared in protocol actors.`,
				remediation: `Verify sender actor ID against protocol definition actors.`,
			});
		}
		if (evt.to && !actorIds.has(evt.to)) {
			diagnostics.push({
				severity: "error",
				code: "UNKNOWN_DESTINATION_ACTOR",
				t: evt.t,
				eventId: evt.id,
				field: "to",
				message: `Destination actor "to": "${evt.to}" is not declared in protocol actors.`,
				remediation: `Verify recipient actor ID against protocol definition actors.`,
			});
		}

		// 6. Event type declaration check
		if (validEventTypes.size > 0 && !validEventTypes.has(evt.event)) {
			diagnostics.push({
				severity: "error",
				code: "UNDECLARED_EVENT_TYPE",
				t: evt.t,
				eventId: evt.id,
				field: "event",
				message: `Event type "${evt.event}" at t=${evt.t} is not defined in messages, operations, or step types.`,
				remediation: `Add "${evt.event}" to protocol definition messages or operationTypes.`,
			});
		}

		// 7. Phase assignment check
		if (evt.phase && validPhases.size > 0 && !validPhases.has(evt.phase)) {
			diagnostics.push({
				severity: "warning",
				code: "INVALID_PHASE",
				t: evt.t,
				eventId: evt.id,
				field: "phase",
				message: `Phase "${evt.phase}" at t=${evt.t} is not a recognized phase for ${protocol.name}.`,
				remediation: `Use one of declared phases: ${Array.from(validPhases).join(", ")}.`,
			});
		}

		// 8. Data flow reference check (inputs must be derived before use)
		const inputs = evt.inputs || [];
		inputs.forEach((inputRef) => {
			if (!producedRefs.has(inputRef)) {
				diagnostics.push({
					severity: "warning",
					code: "UNPRODUCED_REFERENCE",
					t: evt.t,
					eventId: evt.id,
					field: "inputs",
					message: `Event at t=${evt.t} references input "${inputRef}" before it has been produced in the trace.`,
					remediation: `Ensure the operation that produces "${inputRef}" occurs prior to t=${evt.t}.`,
				});
			}
		});

		// Record newly produced outputs
		const outRef = evt.outputRef || evt.output_ref || (evt.metadata?.outputRef as string);
		if (outRef) {
			producedRefs.add(outRef);
		}
		if (evt.payloadRef) {
			producedRefs.add(evt.payloadRef);
		}
	});

	// Check missing responses (e.g. pending request without correlation)
	const pendingRequests = new Map<string, TraceEvent>();
	events.forEach((evt) => {
		if (evt.event.includes("Request") || evt.event.includes("Hello") || evt.event.includes("SYN")) {
			pendingRequests.set(evt.messageId || evt.id, evt);
		} else if (evt.correlationId && pendingRequests.has(evt.correlationId)) {
			pendingRequests.delete(evt.correlationId);
		}
	});

	pendingRequests.forEach((reqEvt) => {
		if (reqEvt.status !== "dropped" && reqEvt.status !== "failed") {
			diagnostics.push({
				severity: "info",
				code: "UNMATCHED_REQUEST",
				t: reqEvt.t,
				eventId: reqEvt.id,
				message: `Request event "${reqEvt.event}" at t=${reqEvt.t} has no corresponding response event.`,
				remediation: "Add a response event with matching correlationId, or mark as dropped/delayed.",
			});
		}
	});

	const errors = diagnostics.filter((d) => d.severity === "error").map((d) => d.message);

	return {
		events,
		diagnostics,
		errors,
	};
}

export function isSequenceEvent(protocol: ProtocolDefinition, event: TraceEvent): boolean {
	if (protocol.messages && protocol.messages[event.event]) {
		return true;
	}
	if (protocol.operationTypes && protocol.operationTypes[event.event]) {
		return true;
	}
	return Boolean(event.from && event.to);
}

export function isTimelineEvent(protocol: ProtocolDefinition, event: TraceEvent): boolean {
	if (protocol.stepTypes && protocol.stepTypes[event.event]) {
		return true;
	}
	return Boolean(event.state || event.kind === "state");
}

export function displayValue(value: unknown): string {
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
