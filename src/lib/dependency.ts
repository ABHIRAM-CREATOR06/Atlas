import type { TraceEvent } from "../types";

export type DependencyNode = {
	id: string;
	label: string;
	kind: "value" | "operation" | "message" | "state";
	producerEventId?: string;
	t?: number;
	actor?: string;
	isCompromised?: boolean;
};

export type DependencyEdge = {
	from: string;
	to: string;
	label?: string;
};

export type DependencyGraphData = {
	nodes: DependencyNode[];
	edges: DependencyEdge[];
};

export function buildDependencyGraph(
	events: TraceEvent[],
	compromisedRefs: string[] = []
): DependencyGraphData {
	const nodesMap = new Map<string, DependencyNode>();
	const edges: DependencyEdge[] = [];
	const compromisedSet = new Set(compromisedRefs);

	events.forEach((evt) => {
		const evtNodeId = `evt_${evt.id}`;
		const isComp = evt.inputs?.some((inp) => compromisedSet.has(inp)) || false;

		nodesMap.set(evtNodeId, {
			id: evtNodeId,
			label: evt.label || evt.event,
			kind: evt.from && evt.to ? "message" : "operation",
			producerEventId: evt.id,
			t: evt.t,
			actor: evt.actor,
			isCompromised: isComp,
		});

		// Check inputs
		(evt.inputs || []).forEach((inpRef) => {
			if (!nodesMap.has(inpRef)) {
				nodesMap.set(inpRef, {
					id: inpRef,
					label: inpRef,
					kind: "value",
					isCompromised: compromisedSet.has(inpRef),
				});
			}
			// Edge from input value -> operation
			edges.push({
				from: inpRef,
				to: evtNodeId,
				label: "consumed",
			});
		});

		// Check outputs
		const outRef = evt.outputRef || evt.output_ref || (evt.metadata?.outputRef as string);
		if (outRef) {
			const isNodeCompromised = compromisedSet.has(outRef) || isComp;
			nodesMap.set(outRef, {
				id: outRef,
				label: outRef,
				kind: "value",
				producerEventId: evt.id,
				t: evt.t,
				actor: evt.actor,
				isCompromised: isNodeCompromised,
			});

			// Edge from operation -> produced value
			edges.push({
				from: evtNodeId,
				to: outRef,
				label: "produced",
			});

			if (isNodeCompromised) {
				compromisedSet.add(outRef);
			}
		}
	});

	return {
		nodes: Array.from(nodesMap.values()),
		edges,
	};
}
