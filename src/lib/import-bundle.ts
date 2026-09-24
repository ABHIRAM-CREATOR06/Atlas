import type { ProtocolDefinition, TraceDiagnostic, TraceEvent } from "../types";
import { validateProtocolDefinition } from "./schema";
import { parseTrace } from "./trace";

export type AtlasBundle = {
	format: "atlas-bundle";
	formatVersion: string;
	protocol: ProtocolDefinition;
	traces?: Record<string, string>;
};

export type ImportResult = {
	valid: boolean;
	kind: "bundle" | "protocol" | "trace";
	protocol?: ProtocolDefinition;
	traceJsonl?: string;
	diagnostics: TraceDiagnostic[];
};

const MAX_JSON_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit for untrusted input

/**
 * Shape-aware parser for single JSONL traces, Protocol definitions, and Atlas bundle v1.0.
 */
export function parseAndValidateImport(
	rawInput: string,
	activeProtocol: ProtocolDefinition,
	existingProtocolIds: string[] = []
): ImportResult {
	const trimmed = rawInput.trim();
	if (!trimmed) {
		return {
			valid: false,
			kind: "trace",
			diagnostics: [
				{
					severity: "error",
					code: "ERR_EMPTY_IMPORT",
					message: "Import content is empty.",
				},
			],
		};
	}

	if (new TextEncoder().encode(trimmed).byteLength > MAX_JSON_SIZE_BYTES) {
		return {
			valid: false,
			kind: "trace",
			diagnostics: [
				{
					severity: "error",
					code: "ERR_IMPORT_TOO_LARGE",
					message: "Import payload exceeds maximum size limit of 5MB.",
				},
			],
		};
	}

	// 1. Try parsing JSON object (Atlas bundle or Protocol Definition)
	if (trimmed.startsWith("{")) {
		try {
			const obj = JSON.parse(trimmed);

			// Check for Atlas Bundle format
			if (obj.format === "atlas-bundle") {
				const bundle = obj as AtlasBundle;
				const { valid, diagnostics } = validateProtocolDefinition(bundle.protocol);

				if (existingProtocolIds.includes(bundle.protocol.id)) {
					diagnostics.push({
						severity: "warning",
						code: "WARN_PROTOCOL_ID_COLLISION",
						message: `Protocol ID "${bundle.protocol.id}" already registered. Custom import will act as local session override.`,
					});
				}

				return {
					valid: valid,
					kind: "bundle",
					protocol: bundle.protocol,
					traceJsonl: bundle.traces?.normal || bundle.traces?.default,
					diagnostics,
				};
			}

			// Single Protocol Definition object
			if (obj.id && obj.actors && Array.isArray(obj.actors)) {
				const { valid, diagnostics } = validateProtocolDefinition(obj);
				return {
					valid: valid,
					kind: "protocol",
					protocol: obj as ProtocolDefinition,
					diagnostics,
				};
			}
		} catch (err) {
			// Fall through to JSONL trace parsing
		}
	}

	// 2. Parse as JSONL trace lines
	const traceRes = parseTrace(trimmed, activeProtocol);
	return {
		valid: traceRes.errors.length === 0,
		kind: "trace",
		traceJsonl: trimmed,
		diagnostics: traceRes.diagnostics,
	};
}
