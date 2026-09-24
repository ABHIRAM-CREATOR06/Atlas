import type { ProtocolDefinition, TraceDiagnostic, TraceEvent } from "../types";

export function validateProtocolDefinition(data: unknown): { valid: boolean; diagnostics: TraceDiagnostic[] } {
	const diagnostics: TraceDiagnostic[] = [];

	if (!data || typeof data !== "object") {
		diagnostics.push({
			severity: "error",
			code: "INVALID_PROTOCOL_OBJECT",
			message: "Protocol definition must be a valid JSON object.",
			remediation: "Ensure the file contains a top-level JSON object.",
		});
		return { valid: false, diagnostics };
	}

	const proto = data as Partial<ProtocolDefinition>;

	if (!proto.id || typeof proto.id !== "string") {
		diagnostics.push({
			severity: "error",
			code: "MISSING_PROTOCOL_ID",
			field: "id",
			message: "Protocol definition is missing a valid 'id' string.",
			remediation: "Add an 'id' field, e.g. \"id\": \"tcp-3way\".",
		});
	}

	if (!proto.name || typeof proto.name !== "string") {
		diagnostics.push({
			severity: "error",
			code: "MISSING_PROTOCOL_NAME",
			field: "name",
			message: "Protocol definition is missing a valid 'name' string.",
			remediation: "Add a 'name' field, e.g. \"name\": \"TCP Three-Way Handshake\".",
		});
	}

	if (!proto.description || typeof proto.description !== "string") {
		diagnostics.push({
			severity: "warning",
			code: "MISSING_PROTOCOL_DESCRIPTION",
			field: "description",
			message: "Protocol definition should include a descriptive 'description' string.",
			remediation: "Add a 'description' field summarizing the protocol's purpose.",
		});
	}

	if (!Array.isArray(proto.actors) || proto.actors.length === 0) {
		diagnostics.push({
			severity: "error",
			code: "MISSING_ACTORS",
			field: "actors",
			message: "Protocol definition must declare at least one actor in the 'actors' array.",
			remediation: "Define actors with id, label, and color.",
		});
	} else {
		proto.actors.forEach((act, idx) => {
			if (!act || typeof act !== "object" || !act.id || !act.label) {
				diagnostics.push({
					severity: "error",
					code: "INVALID_ACTOR_ENTRY",
					field: `actors[${idx}]`,
					message: `Actor at index ${idx} is missing required 'id' or 'label'.`,
					remediation: "Each actor must be an object with id, label, and color strings.",
				});
			}
		});
	}

	if (!Array.isArray(proto.phases)) {
		diagnostics.push({
			severity: "warning",
			code: "MISSING_PHASES",
			field: "phases",
			message: "Protocol definition should declare a 'phases' array.",
			remediation: "Define phases array e.g. [{ \"id\": \"init\", \"label\": \"Initialization\" }].",
		});
	}

	if (proto.transitions && Array.isArray(proto.transitions)) {
		proto.transitions.forEach((tr, idx) => {
			if (!tr || !tr.from || !tr.to || !tr.event) {
				diagnostics.push({
					severity: "warning",
					code: "INVALID_TRANSITION",
					field: `transitions[${idx}]`,
					message: `Transition at index ${idx} must specify 'from', 'to', and 'event'.`,
					remediation: "Ensure all transition objects include from, to, and event properties.",
				});
			}
		});
	}

	return {
		valid: diagnostics.filter((d) => d.severity === "error").length === 0,
		diagnostics,
	};
}

export function validateTraceEventSchema(data: unknown, lineIndex?: number): { event: TraceEvent | null; diagnostics: TraceDiagnostic[] } {
	const diagnostics: TraceDiagnostic[] = [];

	if (!data || typeof data !== "object") {
		diagnostics.push({
			severity: "error",
			code: "INVALID_EVENT_OBJECT",
			line: lineIndex,
			message: `Line ${lineIndex ?? 0}: Event must be a valid JSON object.`,
			remediation: "Fix JSON syntax error on this line.",
		});
		return { event: null, diagnostics };
	}

	const raw = data as Record<string, unknown>;

	if (raw.t === undefined || typeof raw.t !== "number" || !Number.isFinite(raw.t) || raw.t < 0) {
		diagnostics.push({
			severity: "error",
			code: "INVALID_TIMESTAMP",
			line: lineIndex,
			field: "t",
			message: `Line ${lineIndex ?? 0}: "t" timestamp must be a non-negative numeric timestamp.`,
			remediation: "Provide a non-negative numeric 't' value such as 0, 1, 2...",
		});
	}

	if (!raw.actor || typeof raw.actor !== "string") {
		diagnostics.push({
			severity: "error",
			code: "MISSING_ACTOR",
			line: lineIndex,
			field: "actor",
			message: `Line ${lineIndex ?? 0}: Missing or invalid "actor" field.`,
			remediation: "Specify the actor ID performing or receiving the event.",
		});
	}

	if (!raw.event || typeof raw.event !== "string") {
		diagnostics.push({
			severity: "error",
			code: "MISSING_EVENT_TYPE",
			line: lineIndex,
			field: "event",
			message: `Line ${lineIndex ?? 0}: Missing or invalid "event" field.`,
			remediation: "Specify a declared message, operation, or step event name.",
		});
	}

	let id: string;
	if (raw.id && typeof raw.id === "string") {
		id = raw.id;
	} else {
		id = `evt_line${lineIndex ?? raw.t ?? 0}`;
		diagnostics.push({
			severity: "info",
			code: "GENERATED_EVENT_ID",
			line: lineIndex,
			message: `Line ${lineIndex ?? 0}: Event missing explicit 'id'. Assigned fallback ID "${id}".`,
			remediation: "Provide a unique 'id' field for each event in the trace.",
		});
	}

	const event: TraceEvent = {
		id,
		t: Number(raw.t ?? 0),
		sourceLine: lineIndex,
		actor: String(raw.actor ?? "unknown"),
		event: String(raw.event ?? "unknown"),
		...raw,
	};

	return {
		event,
		diagnostics,
	};
}

