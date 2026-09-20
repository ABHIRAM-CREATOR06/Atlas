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

	if (!Array.isArray(proto.actors) || proto.actors.length === 0) {
		diagnostics.push({
			severity: "error",
			code: "MISSING_ACTORS",
			field: "actors",
			message: "Protocol definition must declare at least one actor in the 'actors' array.",
			remediation: "Define actors with id, label, and color.",
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

	if (raw.t === undefined || typeof raw.t !== "number" || !Number.isFinite(raw.t)) {
		diagnostics.push({
			severity: "error",
			code: "INVALID_TIMESTAMP",
			line: lineIndex,
			field: "t",
			message: `Line ${lineIndex ?? 0}: "t" timestamp must be a valid numeric timestamp.`,
			remediation: "Provide a numeric 't' value such as 0, 1, 2...",
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

	const id = String(raw.id ?? `evt_${raw.t ?? lineIndex ?? Math.random()}`);

	const event: TraceEvent = {
		id,
		t: Number(raw.t ?? 0),
		actor: String(raw.actor ?? "unknown"),
		event: String(raw.event ?? "unknown"),
		...raw,
	};

	return {
		event,
		diagnostics,
	};
}
