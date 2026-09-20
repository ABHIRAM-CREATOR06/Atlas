import type { ScenarioDefinition } from "../types";

export const scenarios: Record<string, ScenarioDefinition[]> = {
	"x3dh-ratchet": [
		{
			id: "none",
			name: "Normal Execution",
			category: "network",
			description: "Normal protocol execution without network anomalies or compromised keys.",
			impactDescription: "All messages arrive in order with full confidentiality and integrity.",
			attackerVisibility: "Attacker observes metadata (IP, timestamps, payload size) but cannot read plaintexts.",
			protectedProperties: ["Confidentiality", "Integrity", "Forward Secrecy", "Post-Compromise Recovery"],
			affectedEvents: [],
		},
		{
			id: "passive_observer",
			name: "Passive Network Eavesdropper",
			category: "network",
			description: "Attacker intercepts and records all network traffic between Alice, Server, and Bob.",
			impactDescription: "No impact on payload secrecy due to AEAD encryption and DH key agreement.",
			attackerVisibility: "Sees packet sizes, metadata, public keys (EKa, IKb), but zero plaintext secrets.",
			protectedProperties: ["Payload Confidentiality", "Key Confidentiality"],
			affectedEvents: ["evt_9", "evt_10"],
		},
		{
			id: "key_compromise",
			name: "Compromised Prekey (SPK)",
			category: "compromise",
			description: "Attacker steals Bob's Signed Prekey (spk_bob_21f0) private key at t=12.",
			impactDescription: "Past messages (t < 12) remain protected due to Ephemeral Key (EKa) in DH4 & Double Ratchet.",
			attackerVisibility: "Cannot decrypt past messages (Forward Secrecy preserved).",
			protectedProperties: ["Perfect Forward Secrecy (PFS)"],
			affectedEvents: ["evt_3", "evt_5"],
		},
		{
			id: "replay_attack",
			name: "Replay Attack Attempt",
			category: "attacker",
			description: "Attacker captures InitialMessage (evt_9) and retransmits it to Bob at t=20.",
			impactDescription: "Bob detects duplicate message ID and exhausted one-time prekey, dropping the replayed message.",
			attackerVisibility: "Attacker cannot generate valid new ciphertext without active ratchet key.",
			protectedProperties: ["Replay Protection"],
			affectedEvents: ["evt_9"],
		},
	],

	"tcp-3way": [
		{
			id: "none",
			name: "Normal Handshake",
			category: "network",
			description: "Clean TCP 3-way handshake.",
			impactDescription: "SYN, SYN-ACK, ACK delivered successfully.",
			attackerVisibility: "Attacker sees TCP headers and ISNs.",
			protectedProperties: ["Connection Integrity"],
			affectedEvents: [],
		},
		{
			id: "syn_drop",
			name: "Packet Loss: SYN Dropped",
			category: "network",
			description: "The initial SYN packet is dropped by an intermediate router.",
			impactDescription: "Client retransmission timer fires after timeout (RTO); Client resends SYN.",
			attackerVisibility: "Attacker observes missing ACK.",
			protectedProperties: ["Retransmission Reliability"],
			affectedEvents: ["tcp_1"],
		},
	],
};
