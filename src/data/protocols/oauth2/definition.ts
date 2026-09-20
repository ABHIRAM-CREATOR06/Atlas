import type { ProtocolDefinition } from "../../../types";

export const oauth2Definition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "oauth2",
	name: "OAuth 2.0 Authorization Code Flow",
	version: "2.0.0",
	category: "Identity & Authorization",
	difficulty: "Intermediate",
	tags: ["Delegated Auth", "Tokens", "State Parameter", "PKCE"],
	description:
		"Trace how OAuth 2.0 delegates access rights to client applications via authorization codes and access tokens.",
	documentationUrl: "https://www.rfc-editor.org/rfc/rfc6749",
	learningObjectives: [
		"Understand delegated authorization vs sharing user credentials",
		"Observe authorization code exchange for Bearer access tokens",
		"Trace state parameter protection against Cross-Site Request Forgery (CSRF)",
	],
	actors: [
		{ id: "UserAgent", label: "User Agent", color: "#2878c8", description: "End user browser" },
		{ id: "ClientApp", label: "Client Application", color: "#b66a16", description: "Third-party application (Relying Party)" },
		{ id: "AuthServer", label: "Authorization Server", color: "#8152b8", description: "IdP e.g. Google / Auth0" },
		{ id: "ResourceServer", label: "Resource Server", color: "#188477", description: "API hosting user data" },
	],
	phases: [
		{ id: "authorize", label: "User Consent & Code", description: "Redirect user to Auth Server for consent and receive code" },
		{ id: "token_exchange", label: "Token Exchange", description: "Exchange authorization code for access token" },
		{ id: "access_resource", label: "API Resource Access", description: "Fetch protected resource using Bearer token" },
	],
	messages: {
		AuthRedirect: {
			label: "GET /authorize [client_id, scope, state]",
			color: "#2878c8",
			phase: "authorize",
			fields: [
				{ key: "client_id", label: "Client ID", kind: "text" },
				{ key: "scope", label: "Scope", kind: "text" },
				{ key: "state", label: "State Nonce", kind: "text" },
			],
		},
		AuthCodeReturn: {
			label: "Redirect ➔ /callback?code=xyz123&state=abc",
			color: "#8152b8",
			phase: "authorize",
			fields: [
				{ key: "code", label: "Auth Code", kind: "ref" },
				{ key: "state", label: "State Nonce", kind: "text" },
			],
		},
		TokenRequest: {
			label: "POST /token [code, client_secret]",
			color: "#b66a16",
			phase: "token_exchange",
			fields: [
				{ key: "code", label: "Authorization Code", kind: "ref" },
				{ key: "grant_type", label: "Grant Type", kind: "text" },
			],
		},
		TokenResponse: {
			label: "200 OK [access_token, token_type: Bearer]",
			color: "#8152b8",
			phase: "token_exchange",
			fields: [
				{ key: "access_token", label: "Access Token", kind: "ref" },
				{ key: "expires_in", label: "Expires In (sec)", kind: "number" },
			],
		},
		ApiRequest: {
			label: "GET /userinfo [Authorization: Bearer token]",
			color: "#b66a16",
			phase: "access_resource",
			fields: [{ key: "authorization", label: "Auth Header", kind: "text" }],
		},
		ApiResponse: {
			label: "200 OK [User Profile JSON]",
			color: "#188477",
			phase: "access_resource",
			fields: [{ key: "profile", label: "User Data", kind: "text" }],
		},
	},
	operationTypes: {},
	stepTypes: {},
	stateVariables: [
		{ id: "token_state", label: "Client Access Token", owner: "ClientApp", type: "Token", description: "Active access token" },
	],
	transitions: [
		{ from: "IDLE", to: "CODE_RECEIVED", event: "AuthCodeReturn", label: "Code Acquired" },
		{ from: "CODE_RECEIVED", to: "TOKEN_ACQUIRED", event: "TokenResponse", label: "Token Acquired" },
		{ from: "TOKEN_ACQUIRED", to: "AUTHORIZED", event: "ApiResponse", label: "Resource Accessed" },
	],
	invariants: [],
	securityProperties: [
		{ id: "oauth_sec_1", name: "CSRF Defense", description: "State parameter binds browser session to authorization code response." },
	],
	failureModes: [
		{ id: "oauth_state_mismatch", name: "State Mismatch", description: "State parameter does not match initial request, indicating CSRF attack." },
	],
	glossary: [
		{ term: "Authorization Code", definition: "Short-lived string exchanged by client for access token." },
		{ term: "Bearer Token", definition: "Security token granting access to whoever possesses it." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
