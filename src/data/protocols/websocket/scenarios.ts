import type { ScenarioDefinition } from "../../../types";

export const websocketScenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal Full-Duplex Connection",
		category: "network",
		description: "Clean HTTP upgrade and bidirectional frame exchange.",
		impactDescription: "Sockets remain open with Ping/Pong heartbeat.",
		attackerVisibility: "Observer sees TLS encrypted socket stream.",
		protectedProperties: ["Connection Persistence"],
		affectedEvents: [],
	},
	{
		id: "idle_timeout",
		name: "Missed Pong Timeout",
		category: "network",
		description: "Client fails to respond to Ping within timeout interval.",
		impactDescription: "Server terminates socket connection with code 1006.",
		attackerVisibility: "Observer sees connection reset.",
		protectedProperties: ["Connection Cleanup"],
		affectedEvents: ["ws_5"],
	},
];
