import type { ScenarioDefinition } from "../../../types";

export const oauth2Scenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal Code Flow",
		category: "network",
		description: "Clean authorization code exchange and token access.",
		impactDescription: "Client application receives user profile data.",
		attackerVisibility: "Attacker on network sees SSL/TLS encrypted OAuth requests.",
		protectedProperties: ["Credential Secrecy", "CSRF Protection"],
		affectedEvents: [],
	},
	{
		id: "csrf_attack",
		name: "CSRF State Mismatch Attack",
		category: "attacker",
		description: "Attacker attempts to inject malicious auth code without valid state nonce.",
		impactDescription: "Client App detects state mismatch and aborts token exchange.",
		attackerVisibility: "Attacker cannot hijack user authorization session.",
		protectedProperties: ["CSRF Prevention"],
		affectedEvents: ["oa_2"],
	},
];
