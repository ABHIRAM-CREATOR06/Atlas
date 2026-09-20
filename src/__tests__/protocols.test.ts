import { describe, expect, it } from "vitest";
import { protocols } from "../data/protocols";
import { scenarios } from "../data/scenarios";
import { traces } from "../data/traces";
import { walkthroughs } from "../data/walkthroughs";
import { parseTrace } from "../lib/trace";

describe("Protocol Catalog Integration Tests", () => {
	it("contains exactly 15 protocol definitions", () => {
		expect(protocols.length).toBe(15);
	});

	it("ensures every protocol has complete metadata and structure", () => {
		for (const proto of protocols) {
			expect(proto.id).toBeDefined();
			expect(proto.name).toBeDefined();
			expect(proto.version).toBeDefined();
			expect(proto.category).toBeDefined();
			expect(proto.difficulty).toBeDefined();
			expect(proto.actors.length).toBeGreaterThan(0);
			expect((proto.securityProperties?.length ?? 0)).toBeGreaterThan(0);
			expect((proto.learningObjectives?.length ?? 0)).toBeGreaterThan(0);
			expect((proto.glossary?.length ?? 0)).toBeGreaterThan(0);
		}
	});

	it("parses valid traces without error diagnostics for all 15 protocols", () => {
		for (const proto of protocols) {
			const rawTrace = traces[proto.id];
			expect(rawTrace, `Missing trace for protocol ${proto.id}`).toBeDefined();

			const parsed = parseTrace(rawTrace, proto);
			expect(parsed.events.length, `Protocol ${proto.id} trace has no events`).toBeGreaterThan(0);

			const errorDiagnostics = parsed.diagnostics.filter((d) => d.severity === "error");
			expect(errorDiagnostics, `Protocol ${proto.id} has parse errors: ${JSON.stringify(errorDiagnostics)}`).toHaveLength(0);
		}
	});

	it("ensures every protocol has walkthrough steps and scenarios", () => {
		for (const proto of protocols) {
			const wt = walkthroughs[proto.id];
			expect(wt, `Missing walkthrough for protocol ${proto.id}`).toBeDefined();
			expect(wt.steps.length, `Walkthrough empty for protocol ${proto.id}`).toBeGreaterThan(0);

			const scenarioList = scenarios[proto.id];
			expect(scenarioList, `Missing scenarios for protocol ${proto.id}`).toBeDefined();
			expect(scenarioList.length, `Scenarios empty for protocol ${proto.id}`).toBeGreaterThan(0);
		}
	});
});
