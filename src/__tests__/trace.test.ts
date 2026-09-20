import { describe, expect, it } from "vitest";
import { protocols } from "../data/protocols";
import { traces } from "../data/traces";
import { buildDependencyGraph } from "../lib/dependency";
import { computeReplayState } from "../lib/replay";
import { validateProtocolDefinition, validateTraceEventSchema } from "../lib/schema";
import { parseTrace } from "../lib/trace";

describe("Atlas Protocol Visualizer Engine", () => {
	it("validates protocol definitions against schema contract", () => {
		const proto = protocols[0];
		const res = validateProtocolDefinition(proto);
		expect(res.valid).toBe(true);
		expect(res.diagnostics.length).toBe(0);
	});

	it("detects invalid protocol definition objects", () => {
		const res = validateProtocolDefinition({ invalid: true });
		expect(res.valid).toBe(false);
		expect(res.diagnostics.some((d) => d.code === "MISSING_PROTOCOL_ID")).toBe(true);
	});

	it("parses bundled JSONL trace events cleanly for X3DH", () => {
		const proto = protocols.find((p) => p.id === "x3dh-ratchet")!;
		const traceJsonl = traces["x3dh-ratchet"];
		const result = parseTrace(traceJsonl, proto);
		expect(result.events.length).toBeGreaterThan(0);
		expect(result.errors.length).toBe(0);
	});

	it("flags undeclared actors in trace events", () => {
		const proto = protocols[0];
		const badTrace = JSON.stringify({
			id: "bad_1",
			t: 1,
			actor: "Mallory",
			event: "FetchPrekeyBundle",
		});
		const result = parseTrace(badTrace, proto);
		expect(result.diagnostics.some((d) => d.code === "UNKNOWN_ACTOR")).toBe(true);
	});

	it("computes deterministic replay state at timestamp t", () => {
		const proto = protocols.find((p) => p.id === "x3dh-ratchet")!;
		const traceJsonl = traces["x3dh-ratchet"];
		const { events } = parseTrace(traceJsonl, proto);
		const replay = computeReplayState(events, proto, 8);
		expect(replay.t).toBe(8);
		expect(replay.activePhase).toBe("derivation");
		expect(replay.derivedValues["sk_77c4"]).toBeDefined();
	});

	it("builds data dependency graph correctly", () => {
		const proto = protocols.find((p) => p.id === "x3dh-ratchet")!;
		const traceJsonl = traces["x3dh-ratchet"];
		const { events } = parseTrace(traceJsonl, proto);
		const graph = buildDependencyGraph(events, ["dh1_91ac"]);
		expect(graph.nodes.length).toBeGreaterThan(0);
		expect(graph.edges.length).toBeGreaterThan(0);
		const compNode = graph.nodes.find((n) => n.id === "dh1_91ac");
		expect(compNode?.isCompromised).toBe(true);
	});
});
