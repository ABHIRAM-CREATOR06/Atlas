import type { Walkthrough } from "../../../types";

export const websocketWalkthrough: Walkthrough = {
	protocolId: "websocket",
	title: "Guided Walkthrough: WebSocket Connection Upgrade & Framing",
	description: "Learn how HTTP upgrades to persistent full-duplex sockets with framing.",
	steps: [
		{
			id: "ws_w1",
			title: "1. HTTP Upgrade Handshake",
			t: 0,
			highlightActors: ["Browser", "Server"],
			narrative: "Browser issues HTTP GET with Upgrade: websocket and Sec-WebSocket-Key headers.",
			whyItMatters: "Allows WebSocket connections to pass through standard HTTP ports 80 and 443.",
			quiz: {
				question: "What HTTP response code indicates an accepted WebSocket upgrade?",
				options: ["101 Switching Protocols", "200 OK", "302 Found"],
				correctIndex: 0,
				explanation: "101 Switching Protocols tells the client that the server agrees to switch to WebSocket protocol.",
			},
		},
		{
			id: "ws_w2",
			title: "2. Full-Duplex Frame Exchange",
			t: 4,
			highlightActors: ["Browser", "Server"],
			narrative: "Both client and server exchange text/binary frames asynchronously without HTTP header overhead.",
			whyItMatters: "Provides sub-millisecond real-time communication for chat, games, and live feeds.",
		},
	],
};
