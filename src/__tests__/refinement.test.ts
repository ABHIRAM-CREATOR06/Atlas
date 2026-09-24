import { describe, expect, it } from "vitest";
import { protocols } from "../data/protocols";
import { buildDependencyGraph } from "../lib/dependency";
import { computeReplayState, evaluateStateMachine } from "../lib/replay";
import { validateProtocolDefinition } from "../lib/schema";
import { parseTrace, sanitizeTraceEvent, sanitizeTraceJsonl } from "../lib/trace";
import type { ProtocolDefinition, TraceEvent } from "../types";

describe("Atlas Refinement & Correctness Verification", () => {
	const sampleProto: ProtocolDefinition = {
		schemaVersion: "1.0",
		id: "test-proto",
		name: "Test Protocol",
		version: "1.0",
		category: "Transport",
		description: "Test protocol definition",
		actors: [
			{ id: "Alice", label: "Alice", color: "#2878c8" },
			{ id: "Bob", label: "Bob", color: "#188477" },
		],
		phases: [{ id: "init", label: "Initialization", description: "Initialization phase" }],
		messages: {
			SYN: { label: "SYN", fields: [] },
			SYN_ACK: { label: "SYN-ACK", fields: [] },
		},
		operationTypes: {},
		stepTypes: {},
		stateVariables: [{ id: "seq", label: "Sequence Number", owner: "Alice", type: "number", description: "Seq" }],
		transitions: [
			{ from: "CLOSED", to: "SYN_SENT", event: "SYN", label: "Send SYN" },
			{ from: "SYN_SENT", to: "ESTABLISHED", event: "SYN_ACK", label: "Receive SYN-ACK" },
		],
		views: ["sequenceDiagram"],
	};

	const canonicalTraceJsonl = [
		JSON.stringify({ id: "evt_1", t: 0, actor: "Alice", event: "SYN", outputRef: "seq_1", state: { seq: "100" }, privateKey: "SUPER_SECRET_ALICE_KEY" }),
		JSON.stringify({ id: "evt_2", t: 1, actor: "Bob", event: "SYN_ACK", inputs: ["seq_1"], outputRef: "ack_1", token: "BEARER_TOKEN_123" }),
	].join("\n");

	it("1. Canonical events preserve state computation regardless of presentation filters", () => {
		const parsed = parseTrace(canonicalTraceJsonl, sampleProto);
		const canonicalEvents = parsed.events;

		// Filter out Alice (mimicking toolbar filter)
		const visibleEvents = canonicalEvents.filter((e) => e.actor === "Bob");
		expect(visibleEvents.length).toBe(1);

		// Replay state using canonicalEvents maintains Alice's state variable initialization
		const replayCanonical = computeReplayState(canonicalEvents, sampleProto, 1);
		expect(replayCanonical.currentStateByActor["Alice"]?.["seq"]).toBe("100");

		// Derived values from earlier events are preserved
		expect(replayCanonical.derivedValues["seq_1"]).toBeDefined();
	});

	it("2. Event-driven state machine evaluates active state and detects illegal transitions", () => {
		const parsed = parseTrace(canonicalTraceJsonl, sampleProto);
		const smEval = evaluateStateMachine(sampleProto, parsed.events, 1);

		expect(smEval.currentState).toBe("ESTABLISHED");
		expect(smEval.traversedTransitions.length).toBe(2);
		expect(smEval.illegalTransitions.length).toBe(0);

		// Invalid transition event order trace
		const invalidOrderTrace = [
			JSON.stringify({ id: "evt_bad", t: 0, actor: "Bob", event: "SYN_ACK" }),
		].join("\n");
		const badParsed = parseTrace(invalidOrderTrace, sampleProto);
		const badSmEval = evaluateStateMachine(sampleProto, badParsed.events, 0);

		expect(badSmEval.illegalTransitions.length).toBe(1);
		expect(badSmEval.illegalTransitions[0].reason).toContain("cannot transition from state \"CLOSED\"");
	});

	it("3. Threat compromise propagation correctly resolves event IDs and transitively marks downstream values", () => {
		const trace = [
			JSON.stringify({ id: "evt_1", t: 0, actor: "Alice", event: "SYN", outputRef: "shared_secret" }),
			JSON.stringify({ id: "evt_2", t: 1, actor: "Bob", event: "SYN_ACK", inputs: ["shared_secret"], outputRef: "session_key" }),
			JSON.stringify({ id: "evt_3", t: 2, actor: "Alice", event: "SYN", inputs: ["unrelated_key"], outputRef: "clean_val" }),
		].join("\n");

		const parsed = parseTrace(trace, sampleProto);
		const graph = buildDependencyGraph(parsed.events, [], ["evt_1"]);

		const evt1Node = graph.nodes.find((n) => n.id === "evt_evt_1");
		const secretNode = graph.nodes.find((n) => n.id === "shared_secret");
		const evt2Node = graph.nodes.find((n) => n.id === "evt_evt_2");
		const sessionKeyNode = graph.nodes.find((n) => n.id === "session_key");
		const cleanNode = graph.nodes.find((n) => n.id === "clean_val");

		expect(evt1Node?.isCompromised).toBe(true);
		expect(secretNode?.isCompromised).toBe(true);
		expect(evt2Node?.isCompromised).toBe(true);
		expect(sessionKeyNode?.isCompromised).toBe(true);
		expect(cleanNode?.isCompromised).toBe(false);
	});

	it("4. Trace export sanitization redacts sensitive secret/key/token fields", () => {
		const sensitiveEvent: TraceEvent = {
			id: "evt_test",
			t: 0,
			actor: "Alice",
			event: "SYN",
			privateKey: "sk_live_secret123",
			fields: {
				token: "bearer_xyz",
				safeField: "public_value",
			},
		};

		const sanitized = sanitizeTraceEvent(sensitiveEvent);
		expect(sanitized.privateKey).toBe("[REDACTED]");
		expect((sanitized.fields as Record<string, unknown>).token).toBe("[REDACTED]");
		expect((sanitized.fields as Record<string, unknown>).safeField).toBe("public_value");

		const sanitizedJsonl = sanitizeTraceJsonl(canonicalTraceJsonl, sampleProto);
		expect(sanitizedJsonl).not.toContain("SUPER_SECRET_ALICE_KEY");
		expect(sanitizedJsonl).not.toContain("BEARER_TOKEN_123");
		expect(sanitizedJsonl).toContain("[REDACTED]");
	});

	it("5. Custom protocol definition validation checks structural completeness", () => {
		const validCustom = {
			schemaVersion: "1.0",
			id: "my-custom-proto",
			name: "My Custom Protocol",
			description: "Custom definition test",
			actors: [{ id: "node1", label: "Node 1", color: "#ff0000" }],
			phases: [{ id: "p1", label: "Phase 1" }],
		};

		const res = validateProtocolDefinition(validCustom);
		expect(res.valid).toBe(true);
		expect(res.diagnostics.length).toBe(0);

		const invalidCustom = {
			id: "bad-proto",
			// missing name and actors
		};
		const badRes = validateProtocolDefinition(invalidCustom);
		expect(badRes.valid).toBe(false);
		expect(badRes.diagnostics.some((d) => d.code === "MISSING_PROTOCOL_NAME")).toBe(true);
		expect(badRes.diagnostics.some((d) => d.code === "MISSING_ACTORS")).toBe(true);
	});
});
