import type { ScenarioDefinition } from "../../../types";

export const grpcScenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal Unary & Streaming RPC",
		category: "network",
		description: "Clean gRPC invocation with status 0 (OK).",
		impactDescription: "Typed response payloads delivered.",
		attackerVisibility: "Observer sees TLS 1.3 encrypted HTTP/2 frames.",
		protectedProperties: ["Type Safety", "Stream Efficiency"],
		affectedEvents: [],
	},
];
