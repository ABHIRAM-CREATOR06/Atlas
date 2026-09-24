import type { ProtocolDefinition, TraceDiagnostic, TraceEvent } from "../types";

export type ConformanceValidator = (
	events: TraceEvent[],
	protocol: ProtocolDefinition
) => TraceDiagnostic[];

const conformanceRegistry = new Map<string, ConformanceValidator>();

// TCP Conformance Validator
conformanceRegistry.set("tcp-syn-seq", (events) => {
	const diags: TraceDiagnostic[] = [];
	let hasSyn = false;
	let hasSynAck = false;

	events.forEach((evt) => {
		if (evt.event === "SYN") {
			hasSyn = true;
		} else if (evt.event === "SYN-ACK") {
			if (!hasSyn) {
				diags.push({
					severity: "error",
					code: "ERR_TCP_SYN_ACK_BEFORE_SYN",
					eventId: evt.id,
					t: evt.t,
					message: "SYN-ACK received before SYN handshake initialization.",
					remediation: "Ensure client sends SYN before server responds with SYN-ACK.",
				});
			}
			hasSynAck = true;
		} else if (evt.event === "ACK") {
			if (!hasSynAck) {
				diags.push({
					severity: "error",
					code: "ERR_TCP_ACK_BEFORE_SYN_ACK",
					eventId: evt.id,
					t: evt.t,
					message: "ACK received before SYN-ACK handshake response.",
					remediation: "Complete SYN / SYN-ACK steps before sending final ACK.",
				});
			}
		}
	});

	return diags;
});

// HTTP Conformance Validator
conformanceRegistry.set("http-req-res", (events) => {
	const diags: TraceDiagnostic[] = [];
	const pendingRequests = new Set<string>();

	events.forEach((evt) => {
		if (evt.event.startsWith("GET") || evt.event.startsWith("POST") || evt.event.includes("Request")) {
			pendingRequests.add(evt.id);
		} else if (evt.event.includes("Response") || evt.event.startsWith("200") || evt.event.startsWith("404")) {
			if (pendingRequests.size === 0) {
				diags.push({
					severity: "error",
					code: "ERR_HTTP_RESPONSE_WITHOUT_REQUEST",
					eventId: evt.id,
					t: evt.t,
					message: "HTTP Response emitted without an active correlated Request.",
					remediation: "Ensure HTTP Client sends Request prior to Server Response.",
				});
			}
		}
	});

	return diags;
});

// TLS 1.3 Conformance Validator
conformanceRegistry.set("tls-handshake-order", (events) => {
	const diags: TraceDiagnostic[] = [];
	let clientHello = false;

	events.forEach((evt) => {
		if (evt.event === "ClientHello") {
			clientHello = true;
		} else if (evt.event === "ServerHello" || evt.event === "Finished") {
			if (!clientHello) {
				diags.push({
					severity: "error",
					code: "ERR_TLS_BEFORE_CLIENT_HELLO",
					eventId: evt.id,
					t: evt.t,
					message: `TLS ${evt.event} received before ClientHello.`,
					remediation: "Handshake must begin with ClientHello.",
				});
			}
		}
	});

	return diags;
});

/**
 * Validate protocol-specific conformance for a trace.
 */
export function validateProtocolConformance(
	events: TraceEvent[],
	protocol: ProtocolDefinition
): TraceDiagnostic[] {
	const ruleIds = protocol.conformance?.ruleIds || [];
	const diagnostics: TraceDiagnostic[] = [];

	ruleIds.forEach((ruleId) => {
		const validator = conformanceRegistry.get(ruleId);
		if (validator) {
			diagnostics.push(...validator(events, protocol));
		}
	});

	return diagnostics;
}
