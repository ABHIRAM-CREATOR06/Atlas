import type { ProtocolDefinition } from "../../../types";

export const grpcDefinition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "grpc",
	name: "gRPC Protocol",
	version: "1.0.0",
	category: "RPC",
	difficulty: "Intermediate",
	tags: ["Protobuf", "Typed RPC", "Server Streaming", "HTTP/2 Transport"],
	description:
		"Trace typed Protocol Buffers RPC requests, responses, and server streaming over HTTP/2 transport.",
	documentationUrl: "https://grpc.io/docs/what-is-grpc/introduction/",
	learningObjectives: [
		"Understand Protobuf typed payload serialization",
		"Observe Unary vs Streaming RPC call mechanics",
		"Trace gRPC metadata headers and status code handling (OK, DEADLINE_EXCEEDED)",
	],
	actors: [
		{ id: "Client", label: "gRPC Client", color: "#2878c8", description: "gRPC stub client" },
		{ id: "Server", label: "gRPC Server", color: "#188477", description: "gRPC service server" },
	],
	phases: [
		{ id: "unary", label: "Unary RPC", description: "Single request -> Single response exchange" },
		{ id: "streaming", label: "Server Streaming", description: "Single request -> Stream of typed responses" },
		{ id: "trailers", label: "Status & Trailers", description: "grpc-status and grpc-message completion trailers" },
	],
	messages: {
		UnaryRequest: {
			label: "POST /UserService/GetUser [GetUserRequest]",
			color: "#2878c8",
			phase: "unary",
			fields: [
				{ key: "user_id", label: "User ID", kind: "number" },
				{ key: "deadline", label: "grpc-timeout", kind: "text" },
			],
		},
		UnaryResponse: {
			label: "HEADERS + DATA [GetUserResponse]",
			color: "#188477",
			phase: "unary",
			fields: [{ key: "user_profile", label: "Protobuf Payload", kind: "text" }],
		},
		StreamRequest: {
			label: "POST /Telemetry/StreamLogs [LogRequest]",
			color: "#2878c8",
			phase: "streaming",
			fields: [{ key: "filter", label: "Log Filter", kind: "text" }],
		},
		StreamDataChunk: {
			label: "DATA Chunk [LogChunk #1]",
			color: "#8152b8",
			phase: "streaming",
			fields: [
				{ key: "seq", label: "Chunk Seq", kind: "number" },
				{ key: "log_msg", label: "Log Text", kind: "text" },
			],
		},
		GrpcStatusOk: {
			label: "HEADERS [grpc-status: 0 (OK)]",
			color: "#188477",
			phase: "trailers",
			fields: [{ key: "status", label: "grpc-status", kind: "number" }],
		},
	},
	operationTypes: {},
	stepTypes: {},
	stateVariables: [],
	transitions: [
		{ from: "IDLE", to: "RPC_SENT", event: "UnaryRequest", label: "RPC Sent" },
		{ from: "RPC_SENT", to: "COMPLETED", event: "GrpcStatusOk", label: "RPC OK" },
	],
	invariants: [],
	securityProperties: [
		{ id: "grpc_sec", name: "TLS / gRPC Credentials", description: "gRPC transport security via TLS 1.3 certificate validation." },
	],
	failureModes: [
		{ id: "grpc_deadline", name: "DEADLINE_EXCEEDED", description: "Server fails to respond within grpc-timeout deadline." },
	],
	glossary: [
		{ term: "Protobuf", definition: "Protocol Buffers language-neutral binary serialization format." },
		{ term: "Unary RPC", definition: "Client sends one request and receives one response." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
