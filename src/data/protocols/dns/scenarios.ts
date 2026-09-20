import type { ScenarioDefinition } from "../../../types";

export const dnsScenarios: ScenarioDefinition[] = [
	{
		id: "none",
		name: "Normal Resolution",
		category: "network",
		description: "Successful DNS A-record resolution and TTL caching.",
		impactDescription: "Client receives 93.184.216.34 IP address.",
		attackerVisibility: "Attacker on local network can see unencrypted UDP DNS query.",
		protectedProperties: ["Name Resolution"],
		affectedEvents: [],
	},
	{
		id: "nxdomain_error",
		name: "NXDOMAIN Failure",
		category: "network",
		description: "Domain name does not exist on authoritative server.",
		impactDescription: "Resolver returns RCODE=3 NXDOMAIN to client.",
		attackerVisibility: "Attacker observes failed resolution attempt.",
		protectedProperties: ["Negative Caching"],
		affectedEvents: ["dns_3", "dns_4"],
	},
];
