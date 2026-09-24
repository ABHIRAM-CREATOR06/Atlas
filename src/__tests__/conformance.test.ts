import { describe, expect, it } from "vitest";
import type { ProtocolDefinition, TraceEvent } from "../types";
import { validateProtocolConformance } from "../lib/conformance";

describe("Protocol Conformance Engine", () => {
	const tcpProto: ProtocolDefinition = {
		schemaVersion: "1.0",
		id: "tcp",
		name: "TCP Protocol",
		version: "RFC 793",
		category: "Transport",
		description: "Transmission Control Protocol",
		actors: [
			{ id: "Client", label: "Client", color: "#2878c8" },
			{ id: "Server", label: "Server", color: "#188477" },
		],
		phases: [{ id: "handshake", label: "Handshake", description: "3-way handshake" }],
		messages: {},
		operationTypes: {},
		stepTypes: {},
		stateVariables: [],
		transitions: [],
		views: ["sequenceDiagram"],
		conformance: {
			ruleIds: ["tcp-syn-seq"],
		},
	};

	it("passes valid TCP 3-way handshake sequence", () => {
		const events: TraceEvent[] = [
			{ id: "evt_1", t: 0, actor: "Client", event: "SYN" },
			{ id: "evt_2", t: 1, actor: "Server", event: "SYN-ACK" },
			{ id: "evt_3", t: 2, actor: "Client", event: "ACK" },
		];

		const diags = validateProtocolConformance(events, tcpProto);
		expect(diags).toHaveLength(0);
	});

	it("detects ACK before SYN-ACK error in invalid TCP sequence", () => {
		const invalidEvents: TraceEvent[] = [
			{ id: "evt_1", t: 0, actor: "Client", event: "SYN" },
			{ id: "evt_2", t: 1, actor: "Client", event: "ACK" },
		];

		const diags = validateProtocolConformance(invalidEvents, tcpProto);
		expect(diags).toHaveLength(1);
		expect(diags[0].code).toBe("ERR_TCP_ACK_BEFORE_SYN_ACK");
	});
});
