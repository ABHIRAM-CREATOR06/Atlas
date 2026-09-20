import type { ScenarioDefinition } from "../../../types";

export const mqttScenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal Pub/Sub Routing",
		category: "network",
		description: "Clean pub/sub routing with QoS 1 PUBACK acknowledgement.",
		impactDescription: "Message delivered with at-least-once guarantee.",
		attackerVisibility: "Attacker observes MQTT packet headers.",
		protectedProperties: ["At-Least-Once Delivery"],
		affectedEvents: [],
	},
];
