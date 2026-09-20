import type { ProtocolDefinition } from "../../../types";

export const dnsDefinition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "dns",
	name: "DNS (Domain Name System)",
	version: "1.0.0",
	category: "Application",
	difficulty: "Beginner",
	tags: ["Name Resolution", "UDP", "Caching", "Hierarchy"],
	description:
		"Trace how DNS resolves human-readable domain names into IP addresses through client stubs, recursive resolvers, and authoritative servers.",
	documentationUrl: "https://www.rfc-editor.org/rfc/rfc1034",
	learningObjectives: [
		"Understand recursive resolution vs authoritative lookup",
		"Trace DNS record types (A, AAAA, CNAME) and TTL caching",
		"Observe cache hits vs cache misses and TCP fallback",
	],
	actors: [
		{ id: "Client", label: "Stub Resolver", color: "#2878c8", description: "Local client operating system" },
		{ id: "Resolver", label: "Recursive Resolver", color: "#8152b8", description: "ISP or Public DNS (1.1.1.1)" },
		{ id: "Authoritative", label: "Authoritative Server", color: "#188477", description: "TLD / Domain Nameserver" },
	],
	phases: [
		{ id: "client_query", label: "Client Query", description: "Client queries recursive resolver" },
		{ id: "authoritative_lookup", label: "Authoritative Lookup", description: "Resolver queries root and authoritative servers" },
		{ id: "response_cache", label: "Response & Caching", description: "Return answer to client and store in TTL cache" },
	],
	messages: {
		DNSQuery: {
			label: "Standard Query (A example.com)",
			color: "#2878c8",
			phase: "client_query",
			fields: [
				{ key: "tx_id", label: "Transaction ID", kind: "text" },
				{ key: "qname", label: "Query Name", kind: "text" },
				{ key: "qtype", label: "Record Type", kind: "text" },
			],
			explanation: {
				short: "Client asks recursive resolver for IPv4 address of example.com.",
			},
		},
		AuthQuery: {
			label: "Iterative Query (A example.com)",
			color: "#8152b8",
			phase: "authoritative_lookup",
			fields: [
				{ key: "tx_id", label: "Transaction ID", kind: "text" },
				{ key: "qname", label: "Query Name", kind: "text" },
			],
			explanation: {
				short: "Recursive resolver queries authoritative nameserver.",
			},
		},
		AuthResponse: {
			label: "Authoritative Answer (93.184.216.34)",
			color: "#188477",
			phase: "authoritative_lookup",
			fields: [
				{ key: "answer", label: "Answer Record", kind: "text" },
				{ key: "ttl", label: "TTL (Seconds)", kind: "number" },
			],
			explanation: {
				short: "Authoritative server returns A record with TTL=3600s.",
			},
		},
		DNSResponse: {
			label: "DNS Response (200 OK)",
			color: "#188477",
			phase: "response_cache",
			fields: [
				{ key: "answer", label: "Answer IP", kind: "text" },
				{ key: "ttl", label: "TTL", kind: "number" },
			],
			explanation: {
				short: "Resolver delivers answer to client and caches result.",
			},
		},
	},
	operationTypes: {},
	stepTypes: {
		CacheStore: {
			label: "TTL Cache Store",
			color: "#8152b8",
			fields: [{ key: "entry", label: "Cached Entry", kind: "text" }],
		},
	},
	stateVariables: [
		{ id: "cache_entry", label: "Resolver Cache", owner: "Resolver", type: "Map", description: "Active TTL cache entries" },
	],
	transitions: [
		{ from: "IDLE", to: "QUERY_SENT", event: "DNSQuery", label: "Query Sent" },
		{ from: "QUERY_SENT", to: "LOOKUP_IN_PROGRESS", event: "AuthQuery", label: "Auth Lookup" },
		{ from: "LOOKUP_IN_PROGRESS", to: "RESOLVED", event: "DNSResponse", label: "Name Resolved" },
	],
	invariants: [],
	securityProperties: [
		{ id: "dns_sec", name: "DNSSEC Integrity", description: "Cryptographic signatures prevent DNS spoofing." },
	],
	failureModes: [
		{ id: "nxdomain", name: "NXDOMAIN", description: "Non-existent domain name.", symptom: "Resolver returns RCODE=3 NXDOMAIN." },
		{ id: "servfail", name: "SERVFAIL", description: "Nameserver unreachable or validation failure.", symptom: "Resolver returns RCODE=2 SERVFAIL." },
	],
	glossary: [
		{ term: "A Record", definition: "IPv4 address record for a hostname." },
		{ term: "TTL", definition: "Time-To-Live in seconds before cached DNS entry expires." },
		{ term: "NXDOMAIN", definition: "DNS response code indicating domain does not exist." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
