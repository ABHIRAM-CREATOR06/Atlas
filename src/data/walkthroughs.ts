import type { Walkthrough } from "../types";
import { dnsWalkthrough } from "./protocols/dns/walkthrough";
import { grpcWalkthrough } from "./protocols/grpc/walkthrough";
import { http2Walkthrough } from "./protocols/http2/walkthrough";
import { mqttWalkthrough } from "./protocols/mqtt/walkthrough";
import { noiseWalkthrough } from "./protocols/noise/walkthrough";
import { oauth2Walkthrough } from "./protocols/oauth2/walkthrough";
import { quicWalkthrough } from "./protocols/quic/walkthrough";
import { raftWalkthrough } from "./protocols/raft/walkthrough";
import { sshWalkthrough } from "./protocols/ssh/walkthrough";
import { webauthnWalkthrough } from "./protocols/webauthn/walkthrough";
import { websocketWalkthrough } from "./protocols/websocket/walkthrough";

export const existingWalkthroughs: Record<string, Walkthrough> = {
	"x3dh-ratchet": {
		protocolId: "x3dh-ratchet",
		title: "Guided Walkthrough: X3DH + Double Ratchet",
		description: "Step-by-step tour of Signal's Extended Triple Diffie-Hellman and Double Ratchet protocol.",
		steps: [
			{
				id: "step_1",
				title: "1. Prekey Upload",
				t: 0,
				highlightActors: ["Bob", "Server"],
				narrative: "Bob generates identity & prekeys and uploads public parameters to server.",
				whyItMatters: "Enables asynchronous offline key agreement.",
			},
			{
				id: "step_2",
				title: "2. Fetch Prekey Bundle",
				t: 2,
				highlightActors: ["Alice", "Server"],
				narrative: "Alice fetches Bob's prekey bundle from server.",
				whyItMatters: "Obtains Bob's public keys required for X3DH Diffie-Hellman computations.",
			},
		],
	},
	"tcp-3way": {
		protocolId: "tcp-3way",
		title: "Guided Walkthrough: TCP Three-Way Handshake",
		description: "Step-by-step tour of TCP connection establishment and ISN synchronization.",
		steps: [
			{
				id: "tcp_step_1",
				title: "1. Client SYN Packet",
				t: 0,
				highlightActors: ["Client", "Server"],
				narrative: "Client generates random ISN and transmits SYN packet.",
				whyItMatters: "Announces starting client sequence number.",
			},
		],
	},
	"http-flow": {
		protocolId: "http-flow",
		title: "Guided Walkthrough: HTTP Request & Response",
		description: "Step-by-step tour of HTTP request and response cycle.",
		steps: [
			{
				id: "http_step_1",
				title: "1. HTTP GET Request",
				t: 0,
				highlightActors: ["Client", "Proxy"],
				narrative: "Client issues HTTP GET request to reverse proxy.",
				whyItMatters: "Initiates statutory application layer request.",
			},
		],
	},
	"tls13-handshake": {
		protocolId: "tls13-handshake",
		title: "Guided Walkthrough: TLS 1.3 Handshake",
		description: "Step-by-step tour of 1-RTT encrypted handshake.",
		steps: [
			{
				id: "tls_step_1",
				title: "1. ClientHello KeyShare",
				t: 0,
				highlightActors: ["Client", "Server"],
				narrative: "Client sends ClientHello with KeyShare parameter.",
				whyItMatters: "Enables single round-trip key exchange.",
			},
		],
	},
};

export const walkthroughs: Record<string, Walkthrough> = {
	...existingWalkthroughs,
	dns: dnsWalkthrough,
	websocket: websocketWalkthrough,
	mqtt: mqttWalkthrough,
	http2: http2Walkthrough,
	quic: quicWalkthrough,
	noise: noiseWalkthrough,
	ssh: sshWalkthrough,
	oauth2: oauth2Walkthrough,
	webauthn: webauthnWalkthrough,
	grpc: grpcWalkthrough,
	raft: raftWalkthrough,
};
