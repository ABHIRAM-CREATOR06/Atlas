import type { ProtocolDefinition } from "../types";
import { dnsDefinition } from "./protocols/dns/definition";
import { grpcDefinition } from "./protocols/grpc/definition";
import { http2Definition } from "./protocols/http2/definition";
import { mqttDefinition } from "./protocols/mqtt/definition";
import { noiseDefinition } from "./protocols/noise/definition";
import { oauth2Definition } from "./protocols/oauth2/definition";
import { quicDefinition } from "./protocols/quic/definition";
import { raftDefinition } from "./protocols/raft/definition";
import { sshDefinition } from "./protocols/ssh/definition";
import { webauthnDefinition } from "./protocols/webauthn/definition";
import { websocketDefinition } from "./protocols/websocket/definition";

export const existingProtocols: ProtocolDefinition[] = [
	{
		schemaVersion: "1.0.0",
		id: "x3dh-ratchet",
		name: "X3DH + Double Ratchet",
		version: "1.0.0",
		category: "End-to-End Encryption",
		difficulty: "Advanced",
		tags: ["Signal Protocol", "Prekeys", "Ratchet", "Forward Secrecy"],
		description:
			"Explore how identity keys, prekeys, Diffie–Hellman operations, and ratchet state combine to establish and evolve an end-to-end encrypted session.",
		documentationUrl: "https://signal.org/docs/",
		learningObjectives: [
			"Understand Extended Triple Diffie–Hellman (X3DH) prekey bundle protocol",
			"Trace how initial root and chain keys are derived from DH outputs",
			"Observe how the Double Ratchet provides Forward Secrecy and Post-Compromise Recovery",
		],
		actors: [
			{ id: "Alice", label: "Alice", color: "#2878c8", description: "Session initiator" },
			{ id: "Server", label: "Prekey server", color: "#8152b8", description: "Untrusted prekey distribution server" },
			{ id: "Bob", label: "Bob", color: "#188477", description: "Session recipient" },
		],
		phases: [
			{ id: "setup", label: "Setup", description: "Publish prekey bundles to untrusted server" },
			{ id: "key_agreement", label: "Key Agreement", description: "Fetch bundle and perform Diffie-Hellman operations" },
			{ id: "derivation", label: "Key Derivation", description: "Execute KDF to compute initial master key" },
			{ id: "messaging", label: "Ratchet Messaging", description: "Evolve root and chain keys per message" },
		],
		messages: {
			PublishPrekeys: {
				label: "Publish Prekeys",
				color: "#8152b8",
				phase: "setup",
				fields: [
					{ key: "identity_key", label: "Identity Key", kind: "ref" },
					{ key: "signed_prekey", label: "Signed Prekey", kind: "ref" },
					{ key: "one_time_prekey", label: "One-Time Prekey", kind: "ref" },
				],
				explanation: {
					short: "Bob uploads signed prekeys and one-time prekeys to the server.",
				},
			},
			FetchPrekeyBundle: {
				label: "Fetch Bundle",
				color: "#b66a16",
				phase: "key_agreement",
				fields: [{ key: "target", label: "Target Actor", kind: "text" }],
			},
			InitialMessage: {
				label: "Initial Encrypted Message",
				color: "#188477",
				phase: "messaging",
				fields: [
					{ key: "ephemeral_key", label: "Alice Ephemeral Key", kind: "ref" },
					{ key: "ciphertext", label: "Payload Ciphertext", kind: "text" },
				],
			},
			RatchetMessage: {
				label: "Ratchet Message",
				color: "#188477",
				phase: "messaging",
				fields: [
					{ key: "ratchet_key", label: "Header Key", kind: "ref" },
					{ key: "seq", label: "Sequence Number", kind: "number" },
					{ key: "ciphertext", label: "Ciphertext", kind: "text" },
				],
			},
		},
		operationTypes: {
			DH: {
				label: "Diffie-Hellman",
				color: "#2878c8",
				fields: [
					{ key: "inputs", label: "Input Keys", kind: "list" },
					{ key: "output_ref", label: "Derived Shared Secret", kind: "ref" },
				],
			},
			KDF: {
				label: "KDF Derive",
				color: "#2878c8",
				fields: [
					{ key: "inputs", label: "Entropy Inputs", kind: "list" },
					{ key: "output_ref", label: "Derived Session Key", kind: "ref" },
				],
			},
			SymmetricEncrypt: {
				label: "AEAD Encrypt",
				color: "#188477",
				fields: [
					{ key: "key", label: "Encryption Key", kind: "ref" },
					{ key: "plaintext", label: "Plaintext", kind: "text" },
				],
			},
		},
		stepTypes: {},
		stateVariables: [
			{ id: "rk_a", label: "Alice Root Key", owner: "Alice", type: "Key", description: "Root Key ratcheted per DH exchange" },
			{ id: "ck_a", label: "Alice Chain Key", owner: "Alice", type: "Key", description: "Chain Key ratcheted per symmetric message" },
			{ id: "rk_b", label: "Bob Root Key", owner: "Bob", type: "Key", description: "Bob's root ratchet key" },
			{ id: "sk_ab", label: "Session Key", owner: "Alice", type: "Key", description: "X3DH derived shared master key" },
		],
		transitions: [
			{ from: "IDLE", to: "BUNDLE_FETCHED", event: "FetchPrekeyBundle", label: "Bundle Acquired" },
			{ from: "BUNDLE_FETCHED", to: "KEY_AGREED", event: "KDF", label: "Keys Derived" },
			{ from: "KEY_AGREED", to: "SESSION_ACTIVE", event: "InitialMessage", label: "Session Active" },
		],
		invariants: [],
		securityProperties: [
			{ id: "sec_1", name: "PFS", description: "Perfect Forward Secrecy via ephemeral DH keys." },
			{ id: "sec_2", name: "PCS", description: "Post-Compromise Recovery via Diffie-Hellman ratchet steps." },
		],
		failureModes: [
			{ id: "fail_1", name: "Prekey Exhaustion", description: "One-time prekeys run out on server.", symptom: "Server returns bundle without OTPK." },
		],
		glossary: [
			{ term: "X3DH", definition: "Extended Triple Diffie-Hellman protocol for initial key agreement." },
			{ term: "Double Ratchet", definition: "Combines DH ratchet and symmetric KDF ratchet for messaging." },
		],
		views: ["sequenceDiagram", "stateTimeline", "stateMachine", "dependencyGraph", "guidedWalkthrough"],
	},

	{
		schemaVersion: "1.0.0",
		id: "tcp-3way",
		name: "TCP Three-Way Handshake",
		version: "1.0.0",
		category: "Transport",
		difficulty: "Beginner",
		tags: ["Transport Layer", "SYN", "ACK", "Sequence Numbers"],
		description:
			"Trace how TCP establishes a reliable connection between Client and Server using SYN, SYN-ACK, and ACK sequence number synchronization.",
		documentationUrl: "https://www.rfc-editor.org/rfc/rfc9293",
		learningObjectives: [
			"Understand Sequence Number (SEQ) and Acknowledgement Number (ACK) mechanics",
			"Observe TCP FSM state changes (CLOSED -> SYN_SENT -> ESTABLISHED)",
		],
		actors: [
			{ id: "Client", label: "Client", color: "#2878c8", description: "Initiating TCP endpoint" },
			{ id: "Server", label: "Server", color: "#188477", description: "Listening TCP endpoint" },
		],
		phases: [
			{ id: "handshake", label: "Handshake", description: "Synchronize initial sequence numbers (ISN)" },
			{ id: "data_transfer", label: "Data Transfer", description: "Reliable data segment delivery with ACKs" },
		],
		messages: {
			SYN: {
				label: "SYN [seq=x]",
				color: "#2878c8",
				phase: "handshake",
				fields: [
					{ key: "seq", label: "Sequence Number", kind: "number" },
					{ key: "window", label: "Window Size", kind: "number" },
				],
			},
			SYN_ACK: {
				label: "SYN-ACK [seq=y, ack=x+1]",
				color: "#188477",
				phase: "handshake",
				fields: [
					{ key: "seq", label: "Server SEQ", kind: "number" },
					{ key: "ack", label: "ACK Number", kind: "number" },
				],
			},
			ACK: {
				label: "ACK [ack=y+1]",
				color: "#8152b8",
				phase: "handshake",
				fields: [{ key: "ack", label: "ACK Number", kind: "number" }],
			},
			DATA: {
				label: "TCP Payload [PSH, ACK]",
				color: "#b66a16",
				phase: "data_transfer",
				fields: [
					{ key: "payloadRef", label: "Payload Reference", kind: "ref" },
					{ key: "sizeBytes", label: "Segment Size", kind: "number" },
				],
			},
		},
		operationTypes: {},
		stepTypes: {},
		stateVariables: [
			{ id: "isn_client", label: "Client ISN", owner: "Client", type: "uint32", description: "Initial Sequence Number Client" },
			{ id: "isn_server", label: "Server ISN", owner: "Server", type: "uint32", description: "Initial Sequence Number Server" },
		],
		transitions: [
			{ from: "CLOSED", to: "SYN_SENT", event: "SYN", label: "Send SYN" },
			{ from: "LISTEN", to: "SYN_RCVD", event: "SYN", label: "Receive SYN" },
			{ from: "SYN_RCVD", to: "ESTABLISHED", event: "ACK", label: "Receive ACK" },
			{ from: "SYN_SENT", to: "ESTABLISHED", event: "SYN_ACK", label: "Receive SYN-ACK" },
		],
		invariants: [],
		securityProperties: [
			{ id: "tcp_sec_1", name: "Random ISN", description: "Protects against TCP sequence prediction." },
		],
		failureModes: [
			{ id: "tcp_fail_1", name: "SYN Flood", description: "Attacker sends SYN without returning ACK.", symptom: "SYN backlog queue exhaustion." },
		],
		glossary: [
			{ term: "ISN", definition: "Initial Sequence Number randomly generated per TCP socket." },
		],
		views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
	},

	{
		schemaVersion: "1.0.0",
		id: "http-flow",
		name: "HTTP Request & Response",
		version: "1.0.0",
		category: "Application",
		difficulty: "Beginner",
		tags: ["HTTP/1.1", "Headers", "Proxy", "REST"],
		description:
			"Examine stateless client-server HTTP exchange, header inspection, status codes, proxy forwarding, and payload encoding.",
		documentationUrl: "https://www.rfc-editor.org/rfc/rfc9110",
		learningObjectives: [
			"Trace HTTP GET/POST request headers and body parsing",
			"Understand Proxy hop-by-hop header forwarding",
		],
		actors: [
			{ id: "Client", label: "User Agent", color: "#2878c8", description: "Browser or API client" },
			{ id: "Proxy", label: "Reverse Proxy", color: "#b66a16", description: "Nginx / Gateway proxy" },
			{ id: "Server", label: "Origin Server", color: "#188477", description: "Backend web application" },
		],
		phases: [
			{ id: "req", label: "Request Phase", description: "HTTP Method, Path, Headers, Body" },
			{ id: "resp", label: "Response Phase", description: "HTTP Status Code, Response Headers, Body" },
		],
		messages: {
			HTTPRequest: {
				label: "GET /api/v1/user",
				color: "#2878c8",
				phase: "req",
				fields: [
					{ key: "method", label: "Method", kind: "text" },
					{ key: "path", label: "Path", kind: "text" },
				],
			},
			ProxyForward: {
				label: "Forward GET /api/v1/user",
				color: "#b66a16",
				phase: "req",
				fields: [{ key: "x_forwarded_for", label: "X-Forwarded-For", kind: "text" }],
			},
			HTTPResponse: {
				label: "HTTP/1.1 200 OK",
				color: "#188477",
				phase: "resp",
				fields: [
					{ key: "status", label: "Status Code", kind: "number" },
					{ key: "body", label: "Response Body", kind: "text" },
				],
			},
		},
		operationTypes: {},
		stepTypes: {},
		stateVariables: [],
		transitions: [
			{ from: "IDLE", to: "REQUEST_SENT", event: "HTTPRequest", label: "Send Request" },
			{ from: "REQUEST_SENT", to: "COMPLETED", event: "HTTPResponse", label: "Receive Response" },
		],
		invariants: [],
		securityProperties: [
			{ id: "http_sec_1", name: "Host Header Validation", description: "Protects against HTTP Host Header Injection attacks." },
		],
		failureModes: [
			{ id: "h502", name: "502 Bad Gateway", description: "Proxy cannot reach upstream origin server.", symptom: "Proxy returns 502 error status." },
		],
		glossary: [
			{ term: "User-Agent", definition: "Header identifying client software version." },
		],
		views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
	},

	{
		schemaVersion: "1.0.0",
		id: "tls13-handshake",
		name: "TLS 1.3 Handshake",
		version: "1.0.0",
		category: "Secure Transport",
		difficulty: "Advanced",
		tags: ["TLS 1.3", "ECDHE", "1-RTT", "Certificates"],
		description:
			"Inspect 1-RTT cryptographic handshake in TLS 1.3 including Ephemeral Diffie-Hellman, Certificate Verification, and Encrypted Application Data.",
		documentationUrl: "https://www.rfc-editor.org/rfc/rfc8446",
		learningObjectives: [
			"Understand 1-RTT key exchange via ClientHello key_share extension",
			"Observe server certificate verification and digital signature check",
		],
		actors: [
			{ id: "Client", label: "Client", color: "#2878c8", description: "TLS Client" },
			{ id: "Server", label: "Server", color: "#188477", description: "TLS Server" },
		],
		phases: [
			{ id: "client_hello", label: "Client Hello", description: "Propose cipher suites & KeyShare" },
			{ id: "server_hello", label: "Server Hello", description: "Select cipher & KeyShare" },
			{ id: "encrypted_ext", label: "Encrypted Extensions", description: "Handshake encryption & Certificate" },
			{ id: "finished", label: "Finished & Auth", description: "HMAC Finished verification" },
		],
		messages: {
			ClientHello: {
				label: "ClientHello [KeyShare: X25519]",
				color: "#2878c8",
				phase: "client_hello",
				fields: [{ key: "key_share", label: "Client KeyShare", kind: "ref" }],
			},
			ServerHello: {
				label: "ServerHello [KeyShare: X25519]",
				color: "#188477",
				phase: "server_hello",
				fields: [{ key: "key_share", label: "Server KeyShare", kind: "ref" }],
			},
			EncryptedExtensions: {
				label: "EncryptedExtensions + Certificate",
				color: "#8152b8",
				phase: "encrypted_ext",
				fields: [{ key: "certificate", label: "Server Certificate", kind: "ref" }],
			},
			Finished: {
				label: "Finished [HMAC]",
				color: "#b66a16",
				phase: "finished",
				fields: [{ key: "verify_data", label: "Verify Data (HMAC)", kind: "ref" }],
			},
		},
		operationTypes: {
			HKDF_Extract: {
				label: "HKDF-Extract",
				color: "#2878c8",
				fields: [
					{ key: "inputs", label: "Inputs", kind: "list" },
					{ key: "output_ref", label: "Master Secret Ref", kind: "ref" },
				],
			},
		},
		stepTypes: {},
		stateVariables: [
			{ id: "hs_secret", label: "Handshake Secret", owner: "Client", type: "Key", description: "Derived after ServerHello" },
		],
		transitions: [
			{ from: "IDLE", to: "CH_SENT", event: "ClientHello", label: "ClientHello" },
			{ from: "CH_SENT", to: "SH_RCVD", event: "ServerHello", label: "ServerHello" },
			{ from: "SH_RCVD", to: "CONNECTED", event: "Finished", label: "Handshake Complete" },
		],
		invariants: [],
		securityProperties: [
			{ id: "tls_sec_1", name: "PFS", description: "Perfect Forward Secrecy via ephemeral ECDHE." },
		],
		failureModes: [
			{ id: "cert_fail", name: "Certificate Expired", description: "Server certificate verification failure.", symptom: "Handshake aborted with alert." },
		],
		glossary: [
			{ term: "KeyShare", definition: "Ephemeral public key sent in TLS 1.3 ClientHello." },
		],
		views: ["sequenceDiagram", "stateTimeline", "stateMachine", "dependencyGraph", "guidedWalkthrough"],
	},
];

export const protocols: ProtocolDefinition[] = [
	...existingProtocols,
	dnsDefinition,
	websocketDefinition,
	mqttDefinition,
	http2Definition,
	quicDefinition,
	noiseDefinition,
	sshDefinition,
	oauth2Definition,
	webauthnDefinition,
	grpcDefinition,
	raftDefinition,
];
