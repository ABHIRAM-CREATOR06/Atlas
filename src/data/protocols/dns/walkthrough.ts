import type { Walkthrough } from "../../../types";

export const dnsWalkthrough: Walkthrough = {
	protocolId: "dns",
	title: "Guided Walkthrough: DNS Resolution & Caching",
	description: "Learn how domain names are recursively resolved and cached.",
	steps: [
		{
			id: "dns_w1",
			title: "1. Client Stub Query",
			t: 0,
			highlightActors: ["Client", "Resolver"],
			narrative: "Client application issues a recursive DNS query for 'example.com' to its configured resolver (1.1.1.1).",
			whyItMatters: "Client delegates resolution so it doesn't need to navigate root nameservers directly.",
			quiz: {
				question: "What is the purpose of a stub resolver?",
				options: [
					"To forward resolution requests to a recursive resolver",
					"To host domain zone files",
					"To encrypt all web traffic",
				],
				correctIndex: 0,
				explanation: "Stub resolvers run on client operating systems to send queries to recursive resolvers.",
			},
		},
		{
			id: "dns_w2",
			title: "2. Authoritative Server Lookup",
			t: 2,
			highlightActors: ["Resolver", "Authoritative"],
			narrative: "Resolver queries the authoritative nameserver for 'example.com' zone records.",
			whyItMatters: "Authoritative servers contain the definitive source records for domain names.",
		},
		{
			id: "dns_w3",
			title: "3. TTL Cache & Response",
			t: 5,
			highlightActors: ["Resolver", "Client"],
			narrative: "Resolver stores the A record (93.184.216.34) in its TTL cache and delivers the answer to the client.",
			whyItMatters: "Caching dramatically reduces resolution latency and load on root/authoritative servers.",
		},
	],
};
