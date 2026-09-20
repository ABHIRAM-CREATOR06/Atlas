import type { ScenarioDefinition } from "../../../types";

export const raftScenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal Leader Election",
		category: "network",
		description: "Clean election, majority vote, and log commitment.",
		impactDescription: "Node A elected leader for Term 2 with committed log entries.",
		attackerVisibility: "Observer sees Raft RPC packet metadata.",
		protectedProperties: ["Election Safety", "Leader Completeness"],
		affectedEvents: [],
	},
];
