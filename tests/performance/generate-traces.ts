import type { TraceEvent } from "../../src/types";

/**
 * Generate a deterministic trace with the specified number of events for benchmark performance testing.
 */
export function generateLargeTrace(eventCount: number): TraceEvent[] {
	const events: TraceEvent[] = [];
	const actors = ["Alice", "Bob", "Charlie", "Server"];

	for (let i = 0; i < eventCount; i++) {
		const actor = actors[i % actors.length];
		const nextActor = actors[(i + 1) % actors.length];
		events.push({
			id: `perf_evt_${i}`,
			t: i,
			actor: actor,
			event: i % 2 === 0 ? "DataPacket" : "Acknowledgment",
			from: actor,
			to: nextActor,
			phase: i < eventCount / 2 ? "handshake" : "transfer",
			label: `Message Payload #${i}`,
			fields: {
				sequenceNumber: i,
				payloadSize: 1024 + (i % 512),
				checksum: `0x${i.toString(16)}`,
			},
		});
	}

	return events;
}
