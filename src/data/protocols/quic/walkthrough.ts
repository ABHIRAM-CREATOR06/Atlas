import type { Walkthrough } from "../../../types";

export const quicWalkthrough: Walkthrough = {
	protocolId: "quic",
	title: "Guided Walkthrough: QUIC UDP Transport & Connection Migration",
	description: "Learn how QUIC combines encrypted transport with stream independence and path migration.",
	steps: [
		{
			id: "q_w1",
			title: "1. 1-RTT Integrated Handshake",
			t: 0,
			highlightActors: ["Client", "Server"],
			narrative: "Client sends QUIC Initial packet containing TLS 1.3 ClientHello payload inside UDP datagram.",
			whyItMatters: "Eliminates TCP + TLS duplicate round trips by combining transport and cryptographic setup.",
		},
		{
			id: "q_w2",
			title: "2. Path Migration",
			t: 8,
			highlightActors: ["Client", "Server"],
			narrative: "Client switches IP address (WiFi -> Cellular). QUIC uses stable Connection ID (0x4a99) to validate path without dropping the socket.",
			whyItMatters: "Mobile users stay connected across network transitions without re-handshaking.",
		},
	],
};
