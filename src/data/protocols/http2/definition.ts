import type { ProtocolDefinition } from "../../../types";

export const http2Definition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "http2",
	name: "HTTP/2 Protocol",
	version: "2.0.0",
	category: "Application",
	difficulty: "Intermediate",
	tags: ["Multiplexing", "Binary Framing", "HPACK", "Streams"],
	description:
		"Trace how HTTP/2 interleaves multiple logical request and response streams over a single TCP connection.",
	documentationUrl: "https://www.rfc-editor.org/rfc/rfc9113",
	learningObjectives: [
		"Understand binary framing and Stream ID allocation",
		"Observe HEADERS and DATA frame multiplexing without head-of-line blocking",
		"Trace stream states and RST_STREAM error frames",
	],
	actors: [
		{ id: "Client", label: "Browser Client", color: "#2878c8", description: "HTTP/2 client" },
		{ id: "Server", label: "Web Server", color: "#188477", description: "HTTP/2 server" },
	],
	phases: [
		{ id: "handshake", label: "Connection & Settings", description: "MAGIC prefix & SETTINGS frame exchange" },
		{ id: "multiplexing", label: "Stream Multiplexing", description: "Concurrent HEADERS and DATA frames on streams 1, 3, 5" },
		{ id: "teardown", label: "Stream Teardown", description: "END_STREAM flags and GOAWAY frame" },
	],
	messages: {
		Settings: {
			label: "SETTINGS [MAX_CONCURRENT_STREAMS: 100]",
			color: "#8152b8",
			phase: "handshake",
			fields: [{ key: "max_streams", label: "Max Concurrent Streams", kind: "number" }],
		},
		HeadersFrame1: {
			label: "HEADERS [Stream 1: GET /index.html]",
			color: "#2878c8",
			phase: "multiplexing",
			fields: [
				{ key: "stream_id", label: "Stream ID", kind: "number" },
				{ key: "path", label: "Path", kind: "text" },
			],
		},
		HeadersFrame3: {
			label: "HEADERS [Stream 3: GET /styles.css]",
			color: "#2878c8",
			phase: "multiplexing",
			fields: [
				{ key: "stream_id", label: "Stream ID", kind: "number" },
				{ key: "path", label: "Path", kind: "text" },
			],
		},
		DataFrame1: {
			label: "DATA [Stream 1: HTML bytes]",
			color: "#188477",
			phase: "multiplexing",
			fields: [
				{ key: "stream_id", label: "Stream ID", kind: "number" },
				{ key: "size", label: "Size (bytes)", kind: "number" },
			],
		},
		DataFrame3: {
			label: "DATA [Stream 3: CSS bytes]",
			color: "#188477",
			phase: "multiplexing",
			fields: [
				{ key: "stream_id", label: "Stream ID", kind: "number" },
				{ key: "size", label: "Size (bytes)", kind: "number" },
			],
		},
		RstStream: {
			label: "RST_STREAM [Stream 3: CANCEL]",
			color: "#b42318",
			phase: "multiplexing",
			fields: [
				{ key: "stream_id", label: "Stream ID", kind: "number" },
				{ key: "error_code", label: "Error Code", kind: "text" },
			],
		},
	},
	operationTypes: {},
	stepTypes: {},
	stateVariables: [
		{ id: "active_streams", label: "Open Stream Count", owner: "Client", type: "Counter", description: "Number of active concurrent streams" },
	],
	transitions: [
		{ from: "IDLE", to: "SETTINGS_EXCHANGED", event: "Settings", label: "Settings Exchanged" },
		{ from: "SETTINGS_EXCHANGED", to: "MULTIPLEXING", event: "HeadersFrame1", label: "Streams Open" },
	],
	invariants: [],
	securityProperties: [
		{ id: "h2_sec", name: "HPACK Security", description: "HPACK Huffman encoding prevents CRIME/BREACH compression oracle attacks." },
	],
	failureModes: [
		{ id: "h2_rst", name: "Stream Cancellation", description: "Client cancels individual stream via RST_STREAM frame without closing TCP socket." },
	],
	glossary: [
		{ term: "Stream ID", definition: "31-bit integer identifying independent logical stream within HTTP/2 connection." },
		{ term: "HPACK", definition: "Header compression format for HTTP/2." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
