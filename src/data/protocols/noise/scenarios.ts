import type { ScenarioDefinition } from "../../../types";

export const noiseScenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal Noise XX Pattern",
		category: "network",
		description: "Clean mutual static authentication and transport split.",
		impactDescription: "Chaining keys evolve deterministically into transport keys.",
		attackerVisibility: "Attacker observes ephemeral public keys.",
		protectedProperties: ["Mutual Authentication", "PFS"],
		affectedEvents: [],
	},
];
