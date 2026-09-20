import type { ScenarioDefinition } from "../../../types";

export const http2Scenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal Stream Multiplexing",
		category: "network",
		description: "Concurrent stream interleaving over one connection.",
		impactDescription: "All streams complete independently.",
		attackerVisibility: "Observer sees TLS 1.3 encrypted frames.",
		protectedProperties: ["Stream Independence"],
		affectedEvents: [],
	},
	{
		id: "stream_reset",
		name: "Stream Cancel (RST_STREAM)",
		category: "network",
		description: "Client cancels Stream 3 via RST_STREAM frame.",
		impactDescription: "Server halts processing Stream 3 without closing the connection.",
		attackerVisibility: "Observer sees stream reset frame.",
		protectedProperties: ["Connection Reuse"],
		affectedEvents: ["h2_3"],
	},
];
