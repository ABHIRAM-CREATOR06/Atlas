export type ProtocolTraceCoverage = {
	protocolId: string;
	normal: string;
	failure: string[];
	invalid: string[];
	expectedDiagnosticCodes: string[];
	notes?: string[];
};

export const protocolTraceCoverageManifest: Record<string, ProtocolTraceCoverage> = {
	tcp: {
		protocolId: "tcp",
		normal: "tcp-normal-syn-ack",
		failure: ["tcp-failure-timeout"],
		invalid: ["tcp-invalid-ack-first"],
		expectedDiagnosticCodes: ["ERR_TCP_ACK_BEFORE_SYN_ACK"],
		notes: ["TCP 3-way handshake with normal, timeout, and illegal sequencing traces."],
	},
	http: {
		protocolId: "http",
		normal: "http-normal-get-200",
		failure: ["http-failure-502-bad-gateway"],
		invalid: ["http-invalid-orphaned-response"],
		expectedDiagnosticCodes: ["ERR_HTTP_RESPONSE_WITHOUT_REQUEST"],
	},
	"tls-1.3": {
		protocolId: "tls-1.3",
		normal: "tls-normal-handshake",
		failure: ["tls-failure-alert-expired-cert"],
		invalid: ["tls-invalid-server-hello-first"],
		expectedDiagnosticCodes: ["ERR_TLS_BEFORE_CLIENT_HELLO"],
	},
};
