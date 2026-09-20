import type { Walkthrough } from "../../../types";

export const oauth2Walkthrough: Walkthrough = {
	protocolId: "oauth2",
	title: "Guided Walkthrough: OAuth 2.0 Authorization Code Flow",
	description: "Learn how users grant permissions without sharing passwords.",
	steps: [
		{
			id: "oa_w1",
			title: "1. User Consent & Auth Code",
			t: 3,
			highlightActors: ["UserAgent", "AuthServer", "ClientApp"],
			narrative: "User authenticates at Auth Server and approves consent. Auth Server returns short-lived authorization code.",
			whyItMatters: "The user never exposes their password to the third-party client application.",
		},
		{
			id: "oa_w2",
			title: "2. Back-Channel Token Exchange",
			t: 7,
			highlightActors: ["ClientApp", "AuthServer"],
			narrative: "Client App sends code and client secret directly to Auth Server to exchange for a Bearer access token.",
			whyItMatters: "Back-channel token request ensures access tokens are not exposed to the browser URL bar.",
		},
	],
};
