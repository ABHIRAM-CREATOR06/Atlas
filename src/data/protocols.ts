import type { ProtocolDefinition } from "../types";

export const protocols: ProtocolDefinition[] = [
	{
		id: "x3dh-double-ratchet",
		name: "X3DH + Double Ratchet",
		description: "Signal-style setup and linear ratchet replay with symbolic references only.",
		actors: [
			{ id: "alice", label: "Alice", color: "#62AEF0" },
			{ id: "server", label: "Prekey server", color: "#9849E8" },
			{ id: "bob", label: "Bob", color: "#27918D" },
		],
		operationTypes: {
			publish_bundle: {
				label: "Publish bundle",
				color: "#9849E8",
				fields: [
					{ key: "inputs", label: "Public values", kind: "list" },
					{ key: "output_ref", label: "Bundle ref", kind: "ref" },
				],
			},
			fetch_bundle: {
				label: "Fetch bundle",
				color: "#FF6D00",
				fields: [
					{ key: "inputs", label: "Request", kind: "list" },
					{ key: "output_ref", label: "Bundle ref", kind: "ref" },
				],
			},
			dh_compute: {
				label: "DH compute",
				color: "#62AEF0",
				fields: [
					{ key: "inputs", label: "Inputs", kind: "list" },
					{ key: "output_ref", label: "Output ref", kind: "ref" },
				],
			},
			kdf_derive: {
				label: "KDF derive",
				color: "#097FE8",
				fields: [
					{ key: "inputs", label: "Inputs", kind: "list" },
					{ key: "output_ref", label: "Secret ref", kind: "ref" },
				],
			},
			aead_encrypt: {
				label: "AEAD encrypt",
				color: "#FFB110",
				fields: [
					{ key: "inputs", label: "Inputs", kind: "list" },
					{ key: "output_ref", label: "Ciphertext ref", kind: "ref" },
				],
			},
		},
		stepTypes: {
			ratchet_dh: {
				label: "DH ratchet",
				color: "#9849E8",
				fields: [
					{ key: "chain", label: "Chain", kind: "text" },
					{ key: "output_ref", label: "Root ref", kind: "ref" },
				],
			},
			ratchet_symmetric: {
				label: "Symmetric ratchet",
				color: "#27918D",
				fields: [
					{ key: "chain", label: "Chain", kind: "text" },
					{ key: "msg_index", label: "Message", kind: "number" },
					{ key: "output_ref", label: "Message key", kind: "ref" },
				],
			},
		},
		statePanels: [
			{ id: "alice-root", label: "Alice root", actor: "alice", field: "root" },
			{ id: "alice-send", label: "Alice send", actor: "alice", field: "send" },
			{ id: "bob-root", label: "Bob root", actor: "bob", field: "root" },
			{ id: "bob-recv", label: "Bob receive", actor: "bob", field: "receive" },
		],
		views: ["sequenceDiagram", "stateTimeline"],
	},
	{
		id: "noise-nn",
		name: "Noise NN",
		description: "A compact one-shot handshake example that only declares a sequence view.",
		actors: [
			{ id: "initiator", label: "Initiator", color: "#62AEF0" },
			{ id: "responder", label: "Responder", color: "#27918D" },
		],
		operationTypes: {
			send_ephemeral: {
				label: "Send ephemeral",
				color: "#FF6D00",
				fields: [
					{ key: "inputs", label: "Public value", kind: "list" },
					{ key: "output_ref", label: "Message ref", kind: "ref" },
				],
			},
			dh_compute: {
				label: "DH compute",
				color: "#62AEF0",
				fields: [
					{ key: "inputs", label: "Inputs", kind: "list" },
					{ key: "output_ref", label: "Output ref", kind: "ref" },
				],
			},
			kdf_derive: {
				label: "KDF derive",
				color: "#097FE8",
				fields: [
					{ key: "inputs", label: "Inputs", kind: "list" },
					{ key: "output_ref", label: "Handshake hash", kind: "ref" },
				],
			},
		},
		stepTypes: {},
		statePanels: [],
		views: ["sequenceDiagram"],
	},
];
