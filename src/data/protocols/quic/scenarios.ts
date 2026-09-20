import type { ScenarioDefinition } from "../../../types";

export const quicScenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal QUIC Transport",
		category: "network",
		description: "Clean QUIC transport setup, streaming, and path validation.",
		impactDescription: "0-RTT/1-RTT encrypted transport over UDP.",
		attackerVisibility: "Observer sees Connection IDs and encrypted UDP frames.",
		protectedProperties: ["Path Migration", "Stream Independence"],
		affectedEvents: [],
	},
];
