import type { ProtocolDefinition } from "../../../types";

export const noiseDefinition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "noise",
	name: "Noise Framework (NN & XX)",
	version: "1.0.0",
	category: "Cryptographic Handshake",
	difficulty: "Advanced",
	tags: ["Handshake Patterns", "Diffie-Hellman", "Chaining Key", "Transport Split"],
	description:
		"Trace Noise Framework patterns NN (ephemeral unauthenticated) and XX (mutual static authentication).",
	documentationUrl: "https://noiseprotocol.org/noise.html",
	learningObjectives: [
		"Understand Noise handshake tokens (e, s, ee, es, se, ss)",
		"Observe Chaining Key (ck) and Handshake Hash (h) evolution per message",
		"Trace transition to transport cipher state split (rx/tx keys)",
	],
	actors: [
		{ id: "Initiator", label: "Initiator", color: "#2878c8", description: "Handshake initiator" },
		{ id: "Responder", label: "Responder", color: "#188477", description: "Handshake responder" },
	],
	phases: [
		{ id: "msg1", label: "Message 1 (e)", description: "Initiator ephemeral key e" },
		{ id: "msg2", label: "Message 2 (e, ee, s, es)", description: "Responder ephemeral e, DH ee, static s, DH es" },
		{ id: "msg3", label: "Message 3 (s, se)", description: "Initiator static s, DH se & transport split" },
	],
	messages: {
		NoiseMsg1: {
			label: "Noise XX Msg 1 [-> e]",
			color: "#2878c8",
			phase: "msg1",
			fields: [{ key: "ephemeral", label: "Ephemeral Key (e)", kind: "ref" }],
		},
		NoiseMsg2: {
			label: "Noise XX Msg 2 [<- e, ee, s, es]",
			color: "#188477",
			phase: "msg2",
			fields: [
				{ key: "ephemeral", label: "Responder Ephemeral (e)", kind: "ref" },
				{ key: "encrypted_static", label: "Encrypted Static (s)", kind: "ref" },
			],
		},
		NoiseMsg3: {
			label: "Noise XX Msg 3 [-> s, se]",
			color: "#2878c8",
			phase: "msg3",
			fields: [{ key: "encrypted_static", label: "Initiator Static (s)", kind: "ref" }],
		},
	},
	operationTypes: {
		MixKey: {
			label: "MixKey (KDF)",
			color: "#8152b8",
			fields: [
				{ key: "inputs", label: "DH Input", kind: "list" },
				{ key: "output_ref", label: "New Chaining Key", kind: "ref" },
			],
		},
	},
	stepTypes: {},
	stateVariables: [
		{ id: "ck", label: "Chaining Key (ck)", owner: "Initiator", type: "Key", description: "Root hash state for KDF" },
	],
	transitions: [
		{ from: "IDLE", to: "MSG1_SENT", event: "NoiseMsg1", label: "Msg 1 Sent" },
		{ from: "MSG1_SENT", to: "MSG2_RCVD", event: "NoiseMsg2", label: "Msg 2 Rcvd" },
		{ from: "MSG2_RCVD", to: "TRANSPORT", event: "NoiseMsg3", label: "Split Transport" },
	],
	invariants: [],
	securityProperties: [
		{ id: "noise_sec_1", name: "Mutual Authentication", description: "Noise XX pattern authenticates both static keys." },
	],
	failureModes: [
		{ id: "noise_fail", name: "Pattern Mismatch", description: "Handshake fails if token sequence does not match pattern." },
	],
	glossary: [
		{ term: "Chaining Key", definition: "Secret state updated by HKDF after each DH operation." },
		{ term: "Transport Split", definition: "Derives independent rx/tx keys for symmetric encryption." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
