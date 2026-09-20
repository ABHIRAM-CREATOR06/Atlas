import { describe, expect, it } from "vitest";
import { protocols } from "../data/protocols";
import { scenarios } from "../data/scenarios";
import { traces } from "../data/traces";
import { buildDependencyGraph } from "../lib/dependency";
import { computeReplayState } from "../lib/replay";
import { parseTrace } from "../lib/trace";
import { invalidActorTrace, unproducedRefTrace } from "./fixtures/invalid-traces";
import { validTCPTrace, validX3DHTrace } from "./fixtures/valid-traces";

describe("Atlas End-to-End User Journey Smoke Test", () => {
	it("executes complete user journey across all bundled protocols and views", () => {
		// 1. Open Atlas & select TLS 1.3 protocol
		const tlsProto = protocols.find((p) => p.id === "tls13-handshake")!;
		expect(tlsProto).toBeDefined();

		// 2. Load TLS trace & parse events
		const tlsTraceJson = traces["tls13-handshake"];
		const parsedTls = parseTrace(tlsTraceJson, tlsProto);
		expect(parsedTls.events.length).toBeGreaterThan(0);
		expect(parsedTls.diagnostics.filter((d) => d.severity === "error").length).toBe(0);

		// 3. Inspect ClientHello event (t=0)
		const clientHelloEvt = parsedTls.events.find((e) => e.event === "ClientHello");
		expect(clientHelloEvt).toBeDefined();
		expect(clientHelloEvt?.actor).toBe("Client");

		// 4. Compute timeline replay state at t=3
		const replayAt3 = computeReplayState(parsedTls.events, tlsProto, 3);
		expect(replayAt3.t).toBe(3);
		expect(replayAt3.currentStateByActor["Client"]?.["hs_secret"]).toBeDefined();

		// 5. Select threat scenario (X3DH Key Compromise)
		const x3dhProto = protocols.find((p) => p.id === "x3dh-ratchet")!;
		const x3dhScenarios = scenarios["x3dh-ratchet"];
		const keyCompScenario = x3dhScenarios.find((s) => s.id === "key_compromise");
		expect(keyCompScenario).toBeDefined();

		// 6. Build dependency graph with scenario compromised refs
		const { events: x3dhEvts } = parseTrace(traces["x3dh-ratchet"], x3dhProto);
		const depGraph = buildDependencyGraph(x3dhEvts, keyCompScenario?.affectedEvents || []);
		expect(depGraph.nodes.length).toBeGreaterThan(0);

		// 7. Verify import & diagnostic generation on invalid traces
		const invalidResult = parseTrace(invalidActorTrace, x3dhProto);
		expect(invalidResult.diagnostics.some((d) => d.code === "UNKNOWN_ACTOR")).toBe(true);

		const unproducedResult = parseTrace(unproducedRefTrace, x3dhProto);
		expect(unproducedResult.diagnostics.some((d) => d.code === "UNPRODUCED_REFERENCE")).toBe(true);

		// 8. Round-trip re-parse valid trace export
		const reParsed = parseTrace(validX3DHTrace, x3dhProto);
		expect(reParsed.events.length).toBe(2);
	});
});
