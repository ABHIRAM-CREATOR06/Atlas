import type { Walkthrough } from "../../../types";

export const sshWalkthrough: Walkthrough = {
	protocolId: "ssh",
	title: "Guided Walkthrough: SSH Key Exchange & Host Verification",
	description: "Learn how SSH authenticates server identity and establishes encrypted channels.",
	steps: [
		{
			id: "ssh_w1",
			title: "1. KEXINIT Algorithm Negotiation",
			t: 2,
			highlightActors: ["Client", "Server"],
			narrative: "Client and Server exchange algorithm lists to negotiate key exchange (curve25519) and encryption ciphers.",
			whyItMatters: "Ensures both endpoints support identical cryptographic primitives before performing DH.",
		},
		{
			id: "ssh_w2",
			title: "2. KEXDH & Host Key Verification",
			t: 6,
			highlightActors: ["Server", "Client"],
			narrative: "Server returns host key and signs the exchange hash H. Client verifies signature against known_hosts.",
			whyItMatters: "Prevents Man-in-the-Middle attacks by validating server identity.",
		},
	],
};
