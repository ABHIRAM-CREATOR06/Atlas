import type { ProtocolDefinition } from "../../../types";

export const websocketDefinition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "websocket",
	name: "WebSocket Protocol",
	version: "1.0.0",
	category: "Messaging",
	difficulty: "Intermediate",
	tags: ["Full-Duplex", "HTTP Upgrade", "Persistent Socket", "Real-Time"],
	description:
		"Trace HTTP 101 Switching Protocols connection upgrade into a persistent, bi-directional, full-duplex WebSocket channel.",
	documentationUrl: "https://www.rfc-editor.org/rfc/rfc6455",
	learningObjectives: [
		"Understand HTTP 101 Switching Protocols handshake",
		"Observe bidirectional text and binary frame exchanges",
		"Trace Ping/Pong heartbeat frames and close handshake codes",
	],
	actors: [
		{ id: "Browser", label: "Client Browser", color: "#2878c8", description: "WebSocket client" },
		{ id: "Server", label: "WebSocket Server", color: "#188477", description: "WebSocket application server" },
	],
	phases: [
		{ id: "upgrade", label: "HTTP Upgrade", description: "HTTP GET request with Upgrade: websocket header" },
		{ id: "open", label: "Full-Duplex Open", description: "Bidirectional text/binary frame transfer" },
		{ id: "heartbeat", label: "Heartbeat", description: "Ping and Pong frame liveness checks" },
		{ id: "closing", label: "Close Handshake", description: "Connection termination with close status code" },
	],
	messages: {
		UpgradeRequest: {
			label: "GET /chat [Upgrade: websocket]",
			color: "#2878c8",
			phase: "upgrade",
			fields: [
				{ key: "sec_key", label: "Sec-WebSocket-Key", kind: "text" },
				{ key: "version", label: "Sec-WebSocket-Version", kind: "number" },
			],
			explanation: {
				short: "Client requests connection upgrade from HTTP to WebSocket protocol.",
			},
		},
		UpgradeResponse: {
			label: "HTTP/1.1 101 Switching Protocols",
			color: "#188477",
			phase: "upgrade",
			fields: [
				{ key: "sec_accept", label: "Sec-WebSocket-Accept", kind: "text" },
			],
			explanation: {
				short: "Server accepts upgrade and derives Sec-WebSocket-Accept challenge response.",
			},
		},
		ClientFrame: {
			label: "Text Frame [Client ➔ Server]",
			color: "#2878c8",
			phase: "open",
			fields: [
				{ key: "payload", label: "Message Payload", kind: "text" },
				{ key: "masked", label: "Masked", kind: "text" },
			],
			explanation: {
				short: "Client sends masked text frame over open WebSocket connection.",
			},
		},
		ServerFrame: {
			label: "Text Frame [Server ➔ Client]",
			color: "#188477",
			phase: "open",
			fields: [
				{ key: "payload", label: "Message Payload", kind: "text" },
			],
			explanation: {
				short: "Server pushes unmasked text frame asynchronously to client.",
			},
		},
		Ping: {
			label: "Control Frame: Ping",
			color: "#8152b8",
			phase: "heartbeat",
			fields: [{ key: "data", label: "Ping Data", kind: "text" }],
		},
		Pong: {
			label: "Control Frame: Pong",
			color: "#8152b8",
			phase: "heartbeat",
			fields: [{ key: "data", label: "Pong Data", kind: "text" }],
		},
		CloseFrame: {
			label: "Control Frame: Close (1000 OK)",
			color: "#b66a16",
			phase: "closing",
			fields: [{ key: "code", label: "Close Status Code", kind: "number" }],
		},
	},
	operationTypes: {},
	stepTypes: {},
	stateVariables: [
		{ id: "socket_state", label: "Socket State", owner: "Browser", type: "Enum", description: "CONNECTING -> OPEN -> CLOSING -> CLOSED" },
	],
	transitions: [
		{ from: "CONNECTING", to: "OPEN", event: "UpgradeResponse", label: "Upgrade Accepted" },
		{ from: "OPEN", to: "CLOSING", event: "CloseFrame", label: "Close Initiated" },
		{ from: "CLOSING", to: "CLOSED", event: "CloseFrame", label: "Connection Closed" },
	],
	invariants: [],
	securityProperties: [
		{ id: "ws_sec_1", name: "Client Masking", description: "Client-to-server frames are XOR masked to prevent proxy cache poisoning." },
	],
	failureModes: [
		{ id: "ws_rejected", name: "Upgrade Rejected", description: "Server returns 400 or 403 response instead of 101." },
	],
	glossary: [
		{ term: "101 Switching Protocols", definition: "HTTP status code agreeing to switch protocols." },
		{ term: "Masking", definition: "Client-side 4-byte XOR frame payload transformation." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
