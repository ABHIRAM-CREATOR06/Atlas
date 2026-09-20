import type { Walkthrough } from "../../../types";

export const noiseWalkthrough: Walkthrough = {
	protocolId: "noise",
	title: "Guided Walkthrough: Noise XX Handshake & Chaining Keys",
	description: "Learn how Noise patterns evolve chaining keys and authenticate static identity keys.",
	steps: [
		{
			id: "n_w1",
			title: "1. Ephemeral Exchange & MixKey",
			t: 0,
			highlightActors: ["Initiator", "Responder"],
			narrative: "Initiator sends ephemeral key e. Responder mixes e with its own ephemeral to compute DH(e, e).",
			whyItMatters: "Updates chaining key state and provides forward secrecy for subsequent static key transfers.",
		},
		{
			id: "n_w2",
			title: "2. Transport Split",
			t: 5,
			highlightActors: ["Initiator", "Responder"],
			narrative: "After Message 3 completes, Chaining Key is split into independent initiating and responding transport keys.",
			whyItMatters: "Handshake transitions to symmetric transport encryption.",
		},
	],
};
