import type { ScenarioDefinition } from "../../../types";

export const webauthnScenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal WebAuthn Assertion",
		category: "network",
		description: "Clean FIDO2 public key assertion signature verification.",
		impactDescription: "User authenticated passwordlessly with hardware security key.",
		attackerVisibility: "Attacker observes public key signature and challenge.",
		protectedProperties: ["Phishing Resistance", "Passwordless Auth"],
		affectedEvents: [],
	},
];
