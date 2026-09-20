import type { ProtocolDefinition } from "../types";

export const protocols: ProtocolDefinition[] = [
	{
		schemaVersion: "1.0.0",
		id: "x3dh-ratchet",
		name: "X3DH + Double Ratchet",
		version: "1.0.0",
		category: "Cryptographic Handshake",
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
					purpose: "Allows offline key agreement so Alice can initiate a session even if Bob is offline.",
				},
			},
			FetchPrekeyBundle: {
				label: "Fetch Bundle",
				color: "#b66a16",
				phase: "key_agreement",
				fields: [{ key: "target", label: "Target Actor", kind: "text" }],
				explanation: {
					short: "Alice requests Bob's public prekey bundle from the server.",
					purpose: "Obtains Bob's public keys required to perform X3DH DH computations.",
				},
			},
			InitialMessage: {
				label: "Initial Encrypted Message",
				color: "#188477",
				phase: "messaging",
				fields: [
					{ key: "ephemeral_key", label: "Alice Ephemeral Key", kind: "ref" },
					{ key: "ciphertext", label: "Payload Ciphertext", kind: "text" },
				],
				explanation: {
					short: "Alice sends her first encrypted payload along with her public identity & ephemeral keys.",
					purpose: "Provides Bob with the public parameters needed to compute identical shared secrets.",
				},
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
				explanation: {
					short: "Message encrypted under current sending chain key.",
					purpose: "Advances symmetric ratchet and guarantees secrecy per message.",
				},
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
				explanation: {
					short: "Computes scalar multiplication between private and public key pairs.",
				},
			},
			KDF: {
				label: "KDF Derive",
				color: "#2878c8",
				fields: [
					{ key: "inputs", label: "Entropy Inputs", kind: "list" },
					{ key: "output_ref", label: "Derived Session Key", kind: "ref" },
				],
				explanation: {
					short: "Key Derivation Function combines HKDF rounds into cryptographic keys.",
				},
			},
			SymmetricEncrypt: {
				label: "AEAD Encrypt",
				color: "#188477",
				fields: [
					{ key: "key", label: "Encryption Key", kind: "ref" },
					{ key: "plaintext", label: "Plaintext", kind: "text" },
				],
				explanation: {
					short: "Encrypts message payload using AEAD cipher (AES-GCM / ChaCha20-Poly1305).",
				},
			},
		},
		stepTypes: {
			StateUpdate: {
				label: "State Update",
				color: "#8152b8",
				fields: [
					{ key: "chain", label: "Chain Name", kind: "text" },
					{ key: "output_ref", label: "New Key Ref", kind: "ref" },
				],
			},
		},
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
		invariants: [
			{ id: "inv_1", name: "Forward Secrecy", description: "Compromising current key cannot decrypt past messages." },
		],
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
		category: "Transport Protocol",
		description:
			"Trace how TCP establishes a reliable connection between Client and Server using SYN, SYN-ACK, and ACK sequence number synchronization.",
		documentationUrl: "https://www.rfc-editor.org/rfc/rfc9293",
		learningObjectives: [
			"Understand Sequence Number (SEQ) and Acknowledgement Number (ACK) mechanics",
			"Observe TCP FSM state changes (CLOSED -> SYN_SENT -> ESTABLISHED)",
			"Understand connection drop and retransmission behaviors",
		],
		actors: [
			{ id: "Client", label: "Client", color: "#2878c8", description: "Initiating TCP endpoint" },
			{ id: "Server", label: "Server", color: "#188477", description: "Listening TCP endpoint" },
		],
		phases: [
			{ id: "handshake", label: "Handshake", description: "Synchronize initial sequence numbers (ISN)" },
			{ id: "data_transfer", label: "Data Transfer", description: "Reliable data segment delivery with ACKs" },
			{ id: "teardown", label: "Teardown", description: "FIN/ACK connection termination" },
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
				explanation: {
					short: "Client sends SYN packet with Initial Sequence Number ISN(c).",
					purpose: "Requests connection opening and advertises starting sequence number.",
				},
			},
			SYN_ACK: {
				label: "SYN-ACK [seq=y, ack=x+1]",
				color: "#188477",
				phase: "handshake",
				fields: [
					{ key: "seq", label: "Server SEQ", kind: "number" },
					{ key: "ack", label: "ACK Number", kind: "number" },
				],
				explanation: {
					short: "Server acknowledges Client SYN and sends its own ISN(s).",
					purpose: "Confirms receipt of Client SYN and synchronizes Server sequence number.",
				},
			},
			ACK: {
				label: "ACK [ack=y+1]",
				color: "#8152b8",
				phase: "handshake",
				fields: [{ key: "ack", label: "ACK Number", kind: "number" }],
				explanation: {
					short: "Client acknowledges Server SYN-ACK.",
					purpose: "Completes 3-way handshake; connection state becomes ESTABLISHED on both sides.",
				},
			},
			DATA: {
				label: "TCP Payload [PSH, ACK]",
				color: "#b66a16",
				phase: "data_transfer",
				fields: [
					{ key: "payloadRef", label: "Payload Reference", kind: "ref" },
					{ key: "sizeBytes", label: "Segment Size", kind: "number" },
				],
				explanation: {
					short: "Application payload data segment.",
					purpose: "Transfers data reliably across the established TCP connection.",
				},
			},
		},
		operationTypes: {},
		stepTypes: {
			TCPState: {
				label: "TCP State Change",
				color: "#8152b8",
				fields: [
					{ key: "state", label: "FSM State", kind: "text" },
					{ key: "window", label: "Window", kind: "number" },
				],
			},
		},
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
		invariants: [
			{ id: "tcp_inv_1", name: "In-Order Delivery", description: "Segments must be acknowledged in sequential byte order." },
		],
		securityProperties: [
			{ id: "tcp_sec_1", name: "Random ISN", description: "Protects against TCP sequence prediction and blind RST injection." },
		],
		failureModes: [
			{ id: "tcp_fail_1", name: "SYN Flood", description: "Attacker sends SYN without returning ACK, exhausting SYN backlog queue.", symptom: "Server SYN queue exhaustion and dropped connections." },
		],
		glossary: [
			{ term: "ISN", definition: "Initial Sequence Number randomly generated per TCP socket connection." },
			{ term: "MSS", definition: "Maximum Segment Size excluding TCP/IP headers." },
		],
		views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
	},

	{
		schemaVersion: "1.0.0",
		id: "http-flow",
		name: "HTTP Request & Response",
		version: "1.0.0",
		category: "Application Protocol",
		description:
			"Examine stateless client-server HTTP exchange, header inspection, status codes, proxy forwarding, and payload encoding.",
		documentationUrl: "https://www.rfc-editor.org/rfc/rfc9110",
		learningObjectives: [
			"Trace HTTP GET/POST request headers and body parsing",
			"Understand Proxy hop-by-hop header forwarding",
			"Inspect response status codes (200 OK, 404 Not Found, 500 Error)",
		],
		actors: [
			{ id: "Client", label: "User Agent", color: "#2878c8", description: "Browser or API client" },
			{ id: "Proxy", label: "Reverse Proxy", color: "#b66a16", description: "Nginx / Gateway proxy" },
			{ id: "Server", label: "Origin Server", color: "#188477", description: "Backend web application" },
		],
		phases: [
			{ id: "conn", label: "Connection", description: "TCP/TLS transport establishment" },
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
					{ key: "headers", label: "Headers", kind: "object" },
				],
				explanation: {
					short: "Client issues HTTP GET request for user resource.",
					purpose: "Requests resource representation from origin server.",
				},
			},
			ProxyForward: {
				label: "Forward GET /api/v1/user",
				color: "#b66a16",
				phase: "req",
				fields: [
					{ key: "x_forwarded_for", label: "X-Forwarded-For", kind: "text" },
				],
				explanation: {
					short: "Proxy forwards request with X-Forwarded-For client IP header.",
				},
			},
			HTTPResponse: {
				label: "HTTP/1.1 200 OK",
				color: "#188477",
				phase: "resp",
				fields: [
					{ key: "status", label: "Status Code", kind: "number" },
					{ key: "content_type", label: "Content-Type", kind: "text" },
					{ key: "body", label: "Response Body", kind: "text" },
				],
				explanation: {
					short: "Origin server responds with 200 OK and JSON payload.",
					purpose: "Delivers requested data payload back to client.",
				},
			},
		},
		operationTypes: {},
		stepTypes: {
			ParseHeader: {
				label: "Header Parsing",
				color: "#8152b8",
				fields: [{ key: "header_count", label: "Header Count", kind: "number" }],
			},
		},
		stateVariables: [],
		transitions: [
			{ from: "IDLE", to: "REQUEST_SENT", event: "HTTPRequest", label: "Send Request" },
			{ from: "REQUEST_SENT", to: "COMPLETED", event: "HTTPResponse", label: "Receive Response" },
		],
		invariants: [],
		securityProperties: [
			{ id: "cors", name: "CORS Checks", description: "Cross-Origin Resource Sharing security validation." },
		],
		failureModes: [
			{ id: "h502", name: "502 Bad Gateway", description: "Proxy cannot reach upstream origin server.", symptom: "Proxy returns 502 error status to client." },
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
		category: "Cryptographic Handshake",
		description:
			"Inspect 1-RTT cryptographic handshake in TLS 1.3 including Ephemeral Diffie-Hellman, Certificate Verification, and Encrypted Application Data.",
		documentationUrl: "https://www.rfc-editor.org/rfc/rfc8446",
		learningObjectives: [
			"Understand 1-RTT key exchange via ClientHello key_share extension",
			"Observe server certificate verification and digital signature check",
			"Trace how handshake secrets transition to application traffic secrets",
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
			{ id: "app_data", label: "Application Data", description: "Symmetric AEAD payload protection" },
		],
		messages: {
			ClientHello: {
				label: "ClientHello [KeyShare: X25519]",
				color: "#2878c8",
				phase: "client_hello",
				fields: [
					{ key: "cipher_suites", label: "Supported Ciphers", kind: "list" },
					{ key: "key_share", label: "Client KeyShare", kind: "ref" },
				],
				explanation: {
					short: "Client offers supported ciphers and ephemeral public key share.",
					purpose: "Enables 1-RTT handshake without waiting for server response.",
				},
			},
			ServerHello: {
				label: "ServerHello [KeyShare: X25519]",
				color: "#188477",
				phase: "server_hello",
				fields: [
					{ key: "selected_cipher", label: "Chosen Cipher", kind: "text" },
					{ key: "key_share", label: "Server KeyShare", kind: "ref" },
				],
				explanation: {
					short: "Server selects TLS_AES_128_GCM_SHA256 and sends server ephemeral key share.",
					purpose: "Both parties now possess parameters to calculate Early Handshake Secret.",
				},
			},
			EncryptedExtensions: {
				label: "EncryptedExtensions + Certificate",
				color: "#8152b8",
				phase: "encrypted_ext",
				fields: [
					{ key: "certificate", label: "Server Certificate", kind: "ref" },
					{ key: "cert_verify", label: "CertificateVerify Signature", kind: "ref" },
				],
				explanation: {
					short: "Server authenticates identity via X.509 certificate digital signature.",
				},
			},
			Finished: {
				label: "Finished [HMAC]",
				color: "#b66a16",
				phase: "finished",
				fields: [{ key: "verify_data", label: "Verify Data (HMAC)", kind: "ref" }],
				explanation: {
					short: "Authenticates transcript integrity up to this step.",
				},
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
			{ id: "app_secret", label: "Application Secret", owner: "Client", type: "Key", description: "Derived after Finished" },
		],
		transitions: [
			{ from: "IDLE", to: "CH_SENT", event: "ClientHello", label: "ClientHello" },
			{ from: "CH_SENT", to: "SH_RCVD", event: "ServerHello", label: "ServerHello" },
			{ from: "SH_RCVD", to: "CONNECTED", event: "Finished", label: "Handshake Complete" },
		],
		invariants: [],
		securityProperties: [
			{ id: "tls_sec_1", name: "PFS", description: "Perfect Forward Secrecy via ephemeral ECDHE." },
			{ id: "tls_sec_2", name: "Encrypted Handshake", description: "All handshake messages after ServerHello are encrypted." },
		],
		failureModes: [
			{ id: "cert_fail", name: "Certificate Expired", description: "Server certificate verification failure.", symptom: "Handshake aborted with decrypt_error or bad_certificate alert." },
		],
		glossary: [
			{ term: "KeyShare", definition: "Ephemeral public key sent in TLS 1.3 ClientHello." },
		],
		views: ["sequenceDiagram", "stateTimeline", "stateMachine", "dependencyGraph", "guidedWalkthrough"],
	},
];
