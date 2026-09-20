import type { Walkthrough } from "../../../types";

export const http2Walkthrough: Walkthrough = {
	protocolId: "http2",
	title: "Guided Walkthrough: HTTP/2 Binary Framing & Multiplexing",
	description: "Learn how HTTP/2 interleaves multiple streams over one connection.",
	steps: [
		{
			id: "h2_w1",
			title: "1. Settings Exchange",
			t: 0,
			highlightActors: ["Client", "Server"],
			narrative: "Client and server exchange SETTINGS frames to negotiate stream limits and window sizes.",
			whyItMatters: "Establishes connection parameters before opening binary streams.",
		},
		{
			id: "h2_w2",
			title: "2. Stream Interleaving",
			t: 3,
			highlightActors: ["Client", "Server"],
			narrative: "Client opens Stream 1 (/index.html) and Stream 3 (/styles.css) concurrently. Server interleaves data frames.",
			whyItMatters: "Eliminates HTTP/1.1 head-of-line blocking by multiplexing requests over one socket.",
		},
	],
};
