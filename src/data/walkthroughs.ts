import type { Walkthrough } from "../types";

export const walkthroughs: Record<string, Walkthrough> = {
	"x3dh-ratchet": {
		protocolId: "x3dh-ratchet",
		title: "Guided Walkthrough: X3DH + Double Ratchet",
		description:
			"Step-by-step tour of Signal's Extended Triple Diffie-Hellman and Double Ratchet protocol.",
		steps: [
			{
				id: "step_1",
				title: "1. Prekey Upload",
				t: 0,
				highlightActors: ["Bob", "Server"],
				narrative:
					"Bob generates his Identity Key (IK), Signed Prekey (SPK), and One-Time Prekeys (OPK), uploading their public components to the untrusted server.",
				whyItMatters:
					"Uploading prekeys enables asynchronous (offline) messaging so Alice can send encrypted messages even when Bob is offline.",
				quiz: {
					question: "Why does Bob upload one-time prekeys to the server?",
					options: [
						"To allow Alice to establish a session while Bob is offline",
						"To hide Bob's identity from Alice",
						"To speed up symmetric encryption",
					],
					correctIndex: 0,
					explanation:
						"Prekeys allow offline key agreement so Alice does not need Bob to be active online to initiate a key exchange.",
				},
			},
			{
				id: "step_2",
				title: "2. Fetch Prekey Bundle",
				t: 2,
				highlightActors: ["Alice", "Server"],
				narrative:
					"Alice fetches Bob's prekey bundle from the server, containing Bob's public Identity Key and Signed Prekey.",
				whyItMatters:
					"Alice gets Bob's verified public keys without needing a live round-trip directly to Bob.",
			},
			{
				id: "step_3",
				title: "3. Diffie-Hellman Computations (DH1 - DH4)",
				t: 4,
				highlightActors: ["Alice"],
				narrative:
					"Alice performs up to 4 Diffie-Hellman operations combining her static identity & ephemeral keys with Bob's static & prekeys.",
				whyItMatters:
					"Combining static and ephemeral keys guarantees both mutual authentication and Perfect Forward Secrecy.",
				quiz: {
					question: "What security property does the ephemeral key (EKa) provide?",
					options: ["Perfect Forward Secrecy", "Non-repudiation", "Speed"],
					correctIndex: 0,
					explanation:
						"If Alice or Bob's long-term identity key is compromised in the future, past sessions encrypted with ephemeral keys remain secure.",
				},
			},
			{
				id: "step_4",
				title: "4. KDF Master Secret Derivation",
				t: 8,
				highlightActors: ["Alice"],
				narrative:
					"Alice feeds all DH outputs into HKDF to derive the master shared secret (sk_77c4), initial Root Key, and Sending Chain Key.",
				whyItMatters:
					"Turns independent DH outputs into a uniform cryptographic master key.",
			},
			{
				id: "step_5",
				title: "5. Initial Encrypted Message",
				t: 10,
				highlightActors: ["Alice", "Bob"],
				narrative:
					"Alice encrypts her message payload under her Sending Chain Key and transmits her ephemeral public key to Bob.",
				whyItMatters:
					"Bob can now perform the identical DH calculations and derive the exact same Root Key and Chain Key.",
			},
		],
	},

	"tcp-3way": {
		protocolId: "tcp-3way",
		title: "Guided Walkthrough: TCP Three-Way Handshake",
		description: "Step-by-step tour of TCP connection establishment and ISN synchronization.",
		steps: [
			{
				id: "tcp_step_1",
				title: "1. Client SYN Packet",
				t: 0,
				highlightActors: ["Client", "Server"],
				narrative:
					"Client generates a random Initial Sequence Number (seq=1000) and sends a SYN packet to Server.",
				whyItMatters:
					"SYN indicates request to open a connection and announces the Client's starting sequence number.",
			},
			{
				id: "tcp_step_2",
				title: "2. Server SYN-ACK Response",
				t: 2,
				highlightActors: ["Server", "Client"],
				narrative:
					"Server receives SYN, acknowledges Client SEQ (ack=1001), generates its own random ISN (seq=5000), and returns SYN-ACK.",
				whyItMatters:
					"Confirms receipt of Client SYN and synchronizes Server sequence numbers.",
			},
			{
				id: "tcp_step_3",
				title: "3. Client ACK & Established State",
				t: 4,
				highlightActors: ["Client", "Server"],
				narrative:
					"Client acknowledges Server SYN-ACK (ack=5001). Both endpoints transition to the ESTABLISHED state.",
				whyItMatters:
					"Connection is now open and ready for bi-directional reliable byte-stream data transfer.",
			},
		],
	},
};
