import type { ScenarioDefinition } from "../types";
import { dnsScenarios } from "./protocols/dns/scenarios";
import { grpcScenarios } from "./protocols/grpc/scenarios";
import { http2Scenarios } from "./protocols/http2/scenarios";
import { mqttScenarios } from "./protocols/mqtt/scenarios";
import { noiseScenarios } from "./protocols/noise/scenarios";
import { oauth2Scenarios } from "./protocols/oauth2/scenarios";
import { quicScenarios } from "./protocols/quic/scenarios";
import { raftScenarios } from "./protocols/raft/scenarios";
import { sshScenarios } from "./protocols/ssh/scenarios";
import { webauthnScenarios } from "./protocols/webauthn/scenarios";
import { websocketScenarios } from "./protocols/websocket/scenarios";

export const existingScenarios: Record<string, ScenarioDefinition[]> = {
	"x3dh-ratchet": [
		{
			id: "none",
			name: "Normal Execution",
			category: "network",
			description: "Normal protocol execution without network anomalies.",
			impactDescription: "All messages arrive in order.",
			attackerVisibility: "Attacker observes metadata.",
			protectedProperties: ["Confidentiality", "Integrity"],
			affectedEvents: [],
		},
		{
			id: "key_compromise",
			name: "Identity Key Compromise",
			category: "cryptographic",
			description: "Attacker obtains Bob's long-term Identity Key.",
			impactDescription: "Future sessions using the compromised key can be impersonated unless forward secrecy is protected.",
			attackerVisibility: "Attacker holds IKb.",
			protectedProperties: ["Forward Secrecy"],
			affectedEvents: ["evt_1", "evt_4"],
		},
	],
	"tcp-3way": [
		{
			id: "none",
			name: "Normal Handshake",
			category: "network",
			description: "Clean TCP 3-way handshake.",
			impactDescription: "SYN, SYN-ACK, ACK delivered successfully.",
			attackerVisibility: "Attacker sees TCP ISNs.",
			protectedProperties: ["Connection Integrity"],
			affectedEvents: [],
		},
	],
	"http-flow": [
		{
			id: "none",
			name: "Normal Request",
			category: "network",
			description: "Clean HTTP GET request and 200 response.",
			impactDescription: "Response returned successfully.",
			attackerVisibility: "Plaintext HTTP visible to network.",
			protectedProperties: ["Availability"],
			affectedEvents: [],
		},
	],
	"tls13-handshake": [
		{
			id: "none",
			name: "Normal 1-RTT Handshake",
			category: "network",
			description: "Clean TLS 1.3 key exchange.",
			impactDescription: "Keys derived and encrypted extensions exchanged.",
			attackerVisibility: "Attacker sees TLS extensions.",
			protectedProperties: ["Confidentiality", "Integrity"],
			affectedEvents: [],
		},
	],
};

export const scenarios: Record<string, ScenarioDefinition[]> = {
	...existingScenarios,
	dns: dnsScenarios,
	websocket: websocketScenarios,
	mqtt: mqttScenarios,
	http2: http2Scenarios,
	quic: quicScenarios,
	noise: noiseScenarios,
	ssh: sshScenarios,
	oauth2: oauth2Scenarios,
	webauthn: webauthnScenarios,
	grpc: grpcScenarios,
	raft: raftScenarios,
};
