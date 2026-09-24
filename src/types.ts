export type ViewId =
	| "sequenceDiagram"
	| "stateTimeline"
	| "stateMachine"
	| "dependencyGraph"
	| "guidedWalkthrough";

export type ProtocolCategory =
	| "Transport"
	| "Application"
	| "Secure Transport"
	| "End-to-End Encryption"
	| "Identity & Authorization"
	| "Messaging"
	| "RPC"
	| "Distributed Systems";

export type ProtocolDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type Explanation = {
	short: string;
	detailed?: string;
	purpose?: string;
	prerequisites?: string[];
	securityProperty?: string;
	failureImpact?: string;
	relatedTerms?: string[];
};

export type ActorDefinition = {
	id: string;
	label: string;
	color: string;
	description?: string;
};

export type RoleDefinition = {
	id: string;
	label: string;
	description: string;
};

export type AssumptionDefinition = {
	id: string;
	label: string;
	description: string;
};

export type PhaseDefinition = {
	id: string;
	label: string;
	description: string;
	color?: string;
};

export type FieldDefinition = {
	key: string;
	label: string;
	kind: "text" | "list" | "ref" | "number" | "object" | "code";
	description?: string;
};

export type MessageDefinition = {
	label: string;
	color?: string;
	phase?: string;
	fields: FieldDefinition[];
	explanation?: Explanation;
};

export type OperationTypeDefinition = {
	label: string;
	color: string;
	fields: FieldDefinition[];
	explanation?: Explanation;
};

export type StepTypeDefinition = {
	label: string;
	color: string;
	fields: FieldDefinition[];
	explanation?: Explanation;
};

export type StateVariableDefinition = {
	id: string;
	label: string;
	owner: string;
	type: string;
	description: string;
};

export type TransitionDefinition = {
	from: string;
	to: string;
	event: string;
	label: string;
	description?: string;
	isError?: boolean;
	isTerminal?: boolean;
};

export type InvariantDefinition = {
	id: string;
	name: string;
	description: string;
	expression?: string;
};

export type SecurityPropertyDefinition = {
	id: string;
	name: string;
	description: string;
	category?: string;
};

export type FailureModeDefinition = {
	id: string;
	name: string;
	description: string;
	symptom?: string;
	remediation?: string;
};

export type GlossaryEntry = {
	term: string;
	definition: string;
	relatedTerms?: string[];
};

export type ProtocolComparisonDetails = {
	layerAndTransport: string;
	deliveryGuarantees: string;
	multiplexing: string;
	statefulness: string;
	securityModel: string;
	latencyProfile: string;
	failureRecovery: string;
	complexity: string;
};

export type ConformanceRule = {
	id: string;
	name: string;
	description: string;
	severity: "error" | "warning" | "info";
	appliesTo?: string[];
};

export type ProtocolConformance = {
	ruleIds: string[];
};

export type ProtocolComparisonProfile = {
	layer: string;
	transports: string[];
	deliveryGuarantee: string;
	orderingGuarantee: string;
	multiplexing: string;
	statefulness: string;
	securityModel: string;
	trustAssumptions: string[];
	latencyProfile: string;
	failureRecovery: string;
	operationalComplexity: string;
	comparisonNotes?: string[];
	sources?: { label: string; url: string }[];
};

export type ProtocolDefinition = {
	schemaVersion: string;
	id: string;
	name: string;
	version: string;
	category: ProtocolCategory | string;
	difficulty?: ProtocolDifficulty;
	tags?: string[];
	description: string;
	documentationUrl?: string;
	learningObjectives?: string[];

	actors: ActorDefinition[];
	roles?: RoleDefinition[];
	assumptions?: AssumptionDefinition[];
	phases: PhaseDefinition[];
	messages: Record<string, MessageDefinition>;
	operationTypes: Record<string, OperationTypeDefinition>;
	stepTypes: Record<string, StepTypeDefinition>;
	stateVariables: StateVariableDefinition[];
	transitions: TransitionDefinition[];
	invariants?: InvariantDefinition[];
	securityProperties?: SecurityPropertyDefinition[];
	failureModes?: FailureModeDefinition[];
	glossary?: GlossaryEntry[];
	views: ViewId[];
	comparisonDetails?: ProtocolComparisonDetails;
	comparisonProfile?: ProtocolComparisonProfile;
	conformance?: ProtocolConformance;
};

export type TraceEvent = {
	schemaVersion?: string;
	id: string;
	t: number;
	sourceLine?: number;
	wallTime?: string;
	actor: string;
	event: string;
	phase?: string;

	from?: string;
	to?: string;
	messageType?: string;
	messageId?: string;
	correlationId?: string;
	parentId?: string;

	sequence?: number;
	transport?: string;
	status?: "sent" | "received" | "delayed" | "dropped" | "duplicated" | "retransmitted" | "failed";
	deliveredAt?: number;

	label?: string;
	inputs?: string[];
	outputRef?: string;
	output_ref?: string; // backwards compatibility
	fields?: Record<string, unknown>;
	payloadRef?: string;
	encoding?: string;
	sizeBytes?: number;

	kind?: string;
	chain?: string;
	state?: Record<string, string>;
	metadata?: Record<string, unknown>;
	explanation?: Explanation;
	[key: string]: unknown;
};

export type TraceDiagnostic = {
	severity: "error" | "warning" | "info";
	code: string;
	line?: number;
	eventId?: string;
	t?: number;
	field?: string;
	message: string;
	remediation?: string;
};

export type ValidationResult = {
	events: TraceEvent[];
	diagnostics: TraceDiagnostic[];
	errors: string[]; // backwards compatibility
};

export type WalkthroughStep = {
	id: string;
	title: string;
	t?: number;
	eventId?: string;
	highlightActors?: string[];
	narrative: string;
	whyItMatters: string;
	quiz?: {
		question: string;
		options: string[];
		correctIndex: number;
		explanation: string;
	};
};

export type Walkthrough = {
	protocolId: string;
	title: string;
	description: string;
	steps: WalkthroughStep[];
};

export type ScenarioDefinition = {
	id: string;
	name: string;
	category: "network" | "attacker" | "compromise" | "cryptographic";
	description: string;
	impactDescription: string;
	attackerVisibility: string;
	protectedProperties: string[];
	affectedEvents?: string[];
	affectedEventIds?: string[];
	compromisedRefs?: string[];
	modifiedEvents?: TraceEvent[];
};

export type ProtocolComparison = {
	id: string;
	title: string;
	protoAId: string;
	protoBId: string;
	question: string;
	summary: string;
	keyDifferences: {
		feature: string;
		protoAValue: string;
		protoBValue: string;
	}[];
};

