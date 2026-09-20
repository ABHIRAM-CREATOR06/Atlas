import type { Walkthrough } from "../../../types";

export const webauthnWalkthrough: Walkthrough = {
	protocolId: "webauthn",
	title: "Guided Walkthrough: WebAuthn Challenge-Response Authentication",
	description: "Learn how hardware authenticators use digital signatures to eliminate passwords.",
	steps: [
		{
			id: "wa_w1",
			title: "1. Challenge Generation",
			t: 0,
			highlightActors: ["Browser", "RelyingParty"],
			narrative: "Relying Party generates a cryptographically random challenge (chal_random_99a).",
			whyItMatters: "Prevents replay attacks by ensuring every authentication response is unique.",
		},
		{
			id: "wa_w2",
			title: "2. Hardware Authenticator Assertion",
			t: 4,
			highlightActors: ["Authenticator", "Browser"],
			narrative: "User verifies presence (TouchID/YubiKey). Authenticator signs clientDataJSON with its private key.",
			whyItMatters: "Private key never leaves the hardware security module.",
		},
	],
};
