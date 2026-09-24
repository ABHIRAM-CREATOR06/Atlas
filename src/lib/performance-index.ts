import type { TraceEvent } from "../types";

export class IndexedTrace {
	private events: TraceEvent[];
	private eventById = new Map<string, TraceEvent>();
	private eventIndexByTimestamp: number[] = [];

	constructor(events: TraceEvent[]) {
		// Ensure sorted by timestamp t
		this.events = [...events].sort((a, b) => a.t - b.t);

		this.events.forEach((evt) => {
			this.eventById.set(evt.id, evt);
			this.eventIndexByTimestamp.push(evt.t);
		});
	}

	public get EventCount(): number {
		return this.events.length;
	}

	public getById(id: string): TraceEvent | undefined {
		return this.eventById.get(id);
	}

	/**
	 * Binary search to find events up to timestamp `maxT`.
	 * Target budget: < 100ms for 10,000 events.
	 */
	public getEventsUpTo(maxT: number): TraceEvent[] {
		let low = 0;
		let high = this.eventIndexByTimestamp.length - 1;
		let boundary = -1;

		while (low <= high) {
			const mid = (low + high) >> 1;
			if (this.eventIndexByTimestamp[mid] <= maxT) {
				boundary = mid;
				low = mid + 1;
			} else {
				high = mid - 1;
			}
		}

		if (boundary === -1) return [];
		return this.events.slice(0, boundary + 1);
	}
}
