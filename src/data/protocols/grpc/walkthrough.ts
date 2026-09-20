import type { Walkthrough } from "../../../types";

export const grpcWalkthrough: Walkthrough = {
	protocolId: "grpc",
	title: "Guided Walkthrough: gRPC Typed Calls & Server Streaming",
	description: "Learn how gRPC serializes typed Protobuf messages over HTTP/2 streams.",
	steps: [
		{
			id: "g_w1",
			title: "1. Unary RPC Request & Response",
			t: 0,
			highlightActors: ["Client", "Server"],
			narrative: "Client issues Unary request with deadline. Server returns serialized Protobuf payload and status 0 (OK).",
			whyItMatters: "Provides type-safe, contract-first API invocation between microservices.",
		},
		{
			id: "g_w2",
			title: "2. Server Streaming RPC",
			t: 5,
			highlightActors: ["Client", "Server"],
			narrative: "Client opens stream. Server pushes multiple response data chunks over time until sending completion trailers.",
			whyItMatters: "Efficiently transmits large or real-time data feeds without polling.",
		},
	],
};
