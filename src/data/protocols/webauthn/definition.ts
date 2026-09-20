import type { ProtocolDefinition } from "../../../types";

export const webauthnDefinition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "webauthn",
	name: "WebAuthn / FIDO2",
	version: "3.0.0",
	category: "Identity & Authorization",
	difficulty: "Advanced",
	tags: ["Passkeys", "Biometrics", "Public Key Auth", "Phishing Resistant"],
	description:
		"Trace WebAuthn challenge-response registration and passwordless authentication using registered public key credentials.",
	documentationUrl: "https://www.w3.org/TR/webauthn-3/",
	learningObjectives: [
		"Understand Relying Party challenge generation and clientDataJSON binding",
		"Observe authenticator assertion digital signature creation over challenge",
		"Trace origin verification preventing phishing attacks",
	],
	actors: [
		{ id: "Browser", label: "Client Browser", color: "#2878c8", description: "User agent with WebAuthn API" },
		{ id: "Authenticator", label: "Security Key / Biometric", color: "#8152b8", description: "Hardware authenticator (YubiKey / TouchID)" },
		{ id: "RelyingParty", label: "Relying Party (Server)", color: "#188477", description: "Web application server" },
	],
	phases: [
		{ id: "challenge", label: "Challenge Generation", description: "Server generates cryptographically random challenge" },
		{ id: "authenticator_sign", label: "Authenticator Signature", description: "Hardware authenticator signs challenge with private key" },
		{ id: "verify", label: "Signature Verification", description: "Server verifies signature against registered public key" },
	],
	messages: {
		GetOptions: {
			label: "POST /auth/options [Challenge: 0x99a]",
			color: "#2878c8",
			phase: "challenge",
			fields: [
				{ key: "challenge", label: "Server Challenge", kind: "ref" },
				{ key: "rp_id", label: "RP ID (Origin)", kind: "text" },
			],
		},
		PromptUser: {
			label: "navigator.credentials.get()",
			color: "#8152b8",
			phase: "authenticator_sign",
			fields: [{ key: "user_presence", label: "User Touch Required", kind: "text" }],
		},
		AssertionReply: {
			label: "Authenticator Signature [sig_webauthn_01]",
			color: "#8152b8",
			phase: "authenticator_sign",
			fields: [
				{ key: "authenticator_data", label: "Auth Data", kind: "text" },
				{ key: "signature", label: "ECDSA Signature", kind: "ref" },
			],
		},
		VerifyAssertion: {
			label: "POST /auth/verify [signature, clientData]",
			color: "#2878c8",
			phase: "verify",
			fields: [
				{ key: "signature", label: "Signature", kind: "ref" },
				{ key: "origin", label: "Validated Origin", kind: "text" },
			],
		},
		AuthSuccess: {
			label: "200 OK [Authenticated Session]",
			color: "#188477",
			phase: "verify",
			fields: [],
		},
	},
	operationTypes: {},
	stepTypes: {},
	stateVariables: [
		{ id: "cred_pubkey", label: "Registered Credential", owner: "RelyingParty", type: "PubKey", description: "User's public key registered on server" },
	],
	transitions: [
		{ from: "IDLE", to: "CHALLENGE_ISSUED", event: "GetOptions", label: "Challenge Issued" },
		{ from: "CHALLENGE_ISSUED", to: "SIGNED", event: "AssertionReply", label: "Signed by Authenticator" },
		{ from: "SIGNED", to: "AUTHENTICATED", event: "AuthSuccess", label: "Verified" },
	],
	invariants: [],
	securityProperties: [
		{ id: "webauthn_sec", name: "Phishing Resistance", description: "Origin binding in clientDataJSON prevents credential use on fake domains." },
	],
	failureModes: [
		{ id: "webauthn_origin_fail", name: "Origin Mismatch", description: "Client origin does not match Relying Party ID." },
	],
	glossary: [
		{ term: "Relying Party", definition: "Web server requiring user authentication." },
		{ term: "clientDataJSON", definition: "Client-constructed payload containing origin and challenge." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
