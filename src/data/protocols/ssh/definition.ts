import type { ProtocolDefinition } from "../../../types";

export const sshDefinition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "ssh",
	name: "SSH Handshake Protocol",
	version: "2.0.0",
	category: "Secure Transport",
	difficulty: "Intermediate",
	tags: ["Remote Shell", "Host Key Verification", "KEX", "User Authentication"],
	description:
		"Trace Secure Shell (SSHv2) protocol version exchange, algorithm negotiation, KEXDH host-key authentication, and userauth channels.",
	documentationUrl: "https://www.rfc-editor.org/rfc/rfc4253",
	learningObjectives: [
		"Understand SSH banner exchange (SSH-2.0-OpenSSH_9.0)",
		"Observe KEXINIT algorithm negotiation and Diffie-Hellman key exchange",
		"Trace host key verification and user authentication (publickey / password)",
	],
	actors: [
		{ id: "Client", label: "SSH Client", color: "#2878c8", description: "Terminal or SSH client" },
		{ id: "Server", label: "SSH Server", color: "#188477", description: "OpenSSH daemon" },
	],
	phases: [
		{ id: "banner", label: "Version Exchange", description: "Identification banner exchange e.g. SSH-2.0" },
		{ id: "kex", label: "Key Exchange (KEX)", description: "Algorithm negotiation and Diffie-Hellman secret computation" },
		{ id: "auth", label: "User Authentication", description: "Publickey / password userauth request" },
		{ id: "channel", label: "Channel & Session", description: "Interactive pty session channel open" },
	],
	messages: {
		VersionBanner: {
			label: "SSH-2.0-OpenSSH_9.3",
			color: "#2878c8",
			phase: "banner",
			fields: [{ key: "version_str", label: "Protocol Banner", kind: "text" }],
		},
		KexInit: {
			label: "SSH_MSG_KEXINIT",
			color: "#8152b8",
			phase: "kex",
			fields: [
				{ key: "kex_algo", label: "KEX Algorithm", kind: "text" },
				{ key: "cipher_algo", label: "Encryption Cipher", kind: "text" },
			],
		},
		KexDhInit: {
			label: "SSH_MSG_KEXDH_INIT [Client e]",
			color: "#2878c8",
			phase: "kex",
			fields: [{ key: "ephemeral_e", label: "Client Ephemeral (e)", kind: "ref" }],
		},
		KexDhReply: {
			label: "SSH_MSG_KEXDH_REPLY [HostKey & Sig]",
			color: "#188477",
			phase: "kex",
			fields: [
				{ key: "host_key", label: "Server Host Key", kind: "ref" },
				{ key: "signature", label: "H Exchange Signature", kind: "ref" },
			],
		},
		UserAuthRequest: {
			label: "SSH_MSG_USERAUTH_REQUEST [publickey]",
			color: "#2878c8",
			phase: "auth",
			fields: [
				{ key: "username", label: "User", kind: "text" },
				{ key: "method", label: "Auth Method", kind: "text" },
			],
		},
		UserAuthSuccess: {
			label: "SSH_MSG_USERAUTH_SUCCESS",
			color: "#188477",
			phase: "auth",
			fields: [],
		},
	},
	operationTypes: {},
	stepTypes: {},
	stateVariables: [
		{ id: "session_id", label: "SSH Session ID", owner: "Client", type: "Hash", description: "Exchange hash H used as session identifier" },
	],
	transitions: [
		{ from: "IDLE", to: "BANNER_SENT", event: "VersionBanner", label: "Banner Exchanged" },
		{ from: "BANNER_SENT", to: "KEX_COMPLETE", event: "KexDhReply", label: "KEX Complete" },
		{ from: "KEX_COMPLETE", to: "AUTHENTICATED", event: "UserAuthSuccess", label: "Authenticated" },
	],
	invariants: [],
	securityProperties: [
		{ id: "ssh_sec", name: "Host Key Verification", description: "Server authenticates its identity via digital signature over exchange hash H." },
	],
	failureModes: [
		{ id: "ssh_host_mismatch", name: "Host Key Changed", description: "Host key signature does not match client known_hosts record." },
	],
	glossary: [
		{ term: "KEX", definition: "Key Exchange algorithm negotiating encryption and MAC ciphers." },
		{ term: "known_hosts", definition: "Client database storing trusted public host keys." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
