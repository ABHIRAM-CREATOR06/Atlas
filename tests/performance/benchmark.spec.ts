import { describe, expect, it } from "vitest";
import { generateLargeTrace } from "./generate-traces";
import { IndexedTrace } from "../../src/lib/performance-index";

describe("Large-Trace Performance Benchmarks", () => {
	it("processes and indexes a 10,000 event trace within performance budget (< 500ms)", () => {
		const startGen = performance.now();
		const events = generateLargeTrace(10000);
		const genTime = performance.now() - startGen;

		const startIndex = performance.now();
		const indexed = new IndexedTrace(events);
		const indexTime = performance.now() - startIndex;

		expect(indexed.EventCount).toBe(10000);
		expect(genTime + indexTime).toBeLessThan(500);
	});

	it("replays timestamps using binary search under budget (< 10ms)", () => {
		const events = generateLargeTrace(10000);
		const indexed = new IndexedTrace(events);

		const startLookup = performance.now();
		const subset = indexed.getEventsUpTo(5000);
		const lookupTime = performance.now() - startLookup;

		expect(subset.length).toBe(5001);
		expect(lookupTime).toBeLessThan(10);
	});
});
