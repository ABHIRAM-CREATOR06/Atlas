import type { ScenarioDefinition } from "../../../types";

export const sshScenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal SSH Authentication",
		category: "network",
		description: "Clean KEX and public key authentication.",
		impactDescription: "Session keys established with verified host key.",
		attackerVisibility: "Attacker observes banner and ciphertext.",
		protectedProperties: ["Host Authentication", "Session Privacy"],
		affectedEvents: [],
	},
];
