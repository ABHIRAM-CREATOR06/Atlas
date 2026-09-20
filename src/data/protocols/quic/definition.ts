import type { ProtocolDefinition } from "../../../types";

export const quicDefinition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "quic",
	name: "QUIC Transport Protocol",
	version: "1.0.0",
	category: "Secure Transport",
	difficulty: "Advanced",
	tags: ["UDP", "Connection Migration", "0-RTT Handshake", "Streams"],
	description:
		"Trace UDP-based encrypted transport featuring integrated TLS 1.3 handshakes, independent streams, and connection migration.",
	documentationUrl: "https://www.rfc-editor.org/rfc/rfc9000",
	learningObjectives: [
		"Understand Connection ID (DCID/SCID) stability across IP changes",
		"Observe independent stream loss detection without transport head-of-line blocking",
		"Trace connection migration from WiFi to cellular networks",
	],
	actors: [
		{ id: "Client", label: "QUIC Client", color: "#2878c8", description: "Browser or mobile client" },
		{ id: "Server", label: "QUIC Server", color: "#188477", description: "QUIC origin server" },
	],
	phases: [
		{ id: "initial", label: "Initial Handshake", description: "UDP Initial packet containing TLS 1.3 ClientHello" },
		{ id: "handshake", label: "Handshake & Encrypted", description: "1-RTT encrypted transport establishment" },
		{ id: "data_stream", label: "Multiplexed Data", description: "Independent stream data frames over UDP" },
		{ id: "migration", label: "Path Migration", description: "Client IP changes while preserving Connection ID" },
	],
	messages: {
		InitialPacket: {
			label: "QUIC Initial [DCID: 0x4a99, ClientHello]",
			color: "#2878c8",
			phase: "initial",
			fields: [
				{ key: "dcid", label: "Destination CID", kind: "text" },
				{ key: "pn", label: "Packet Number", kind: "number" },
			],
		},
		HandshakePacket: {
			label: "QUIC Handshake [ServerHello, EE, Cert]",
			color: "#188477",
			phase: "handshake",
			fields: [{ key: "scid", label: "Source CID", kind: "text" }],
		},
		StreamFrame: {
			label: "STREAM Frame [Stream 4: GET /data]",
			color: "#2878c8",
			phase: "data_stream",
			fields: [
				{ key: "stream_id", label: "Stream ID", kind: "number" },
				{ key: "offset", label: "Offset", kind: "number" },
			],
		},
		AckFrame: {
			label: "ACK Frame [Ack Range: 0..4]",
			color: "#8152b8",
			phase: "data_stream",
			fields: [{ key: "largest_ack", label: "Largest Acked", kind: "number" }],
		},
		PathChallenge: {
			label: "PATH_CHALLENGE [New IP: 203.0.113.88]",
			color: "#b66a16",
			phase: "migration",
			fields: [{ key: "new_ip", label: "Client IP", kind: "text" }],
		},
	},
	operationTypes: {},
	stepTypes: {},
	stateVariables: [
		{ id: "cid", label: "Active Connection ID", owner: "Client", type: "ID", description: "Stable Connection ID surviving IP change" },
	],
	transitions: [
		{ from: "IDLE", to: "HANDSHAKE", event: "InitialPacket", label: "Initial Sent" },
		{ from: "HANDSHAKE", to: "ESTABLISHED", event: "HandshakePacket", label: "QUIC Established" },
		{ from: "ESTABLISHED", to: "MIGRATED", event: "PathChallenge", label: "Path Migrated" },
	],
	invariants: [],
	securityProperties: [
		{ id: "quic_sec_1", name: "Integrated TLS 1.3", description: "Entire QUIC packet payload except flags and Connection ID is encrypted." },
	],
	failureModes: [
		{ id: "quic_loss", name: "Packet Loss", description: "UDP packet loss affects only the containing stream." },
	],
	glossary: [
		{ term: "Connection ID", definition: "Opaque identifier allowing QUIC connections to survive client IP changes." },
		{ term: "Path Migration", definition: "Probing and switching network paths without re-handshaking." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
