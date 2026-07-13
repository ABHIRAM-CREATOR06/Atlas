export type ViewId = "sequenceDiagram" | "stateTimeline";

export type ActorDefinition = {
	id: string;
	label: string;
	color: string;
};

export type FieldDefinition = {
	key: string;
	label: string;
	kind: "text" | "list" | "ref" | "number";
};

export type OperationTypeDefinition = {
	label: string;
	color: string;
	fields: FieldDefinition[];
};

export type StepTypeDefinition = {
	label: string;
	color: string;
	fields: FieldDefinition[];
};

export type StatePanelDefinition = {
	id: string;
	label: string;
	actor?: string;
	field: string;
};

export type ProtocolDefinition = {
	id: string;
	name: string;
	description: string;
	actors: ActorDefinition[];
	operationTypes: Record<string, OperationTypeDefinition>;
	stepTypes: Record<string, StepTypeDefinition>;
	statePanels: StatePanelDefinition[];
	views: ViewId[];
};

export type TraceEvent = {
	t: number;
	actor: string;
	event: string;
	label?: string;
	from?: string;
	to?: string;
	inputs?: string[];
	output_ref?: string;
	kind?: string;
	chain?: string;
	msg_index?: number;
	state?: Record<string, string>;
	[key: string]: unknown;
};

export type ValidationResult = {
	events: TraceEvent[];
	errors: string[];
};
