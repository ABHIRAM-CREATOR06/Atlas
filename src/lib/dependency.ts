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
	compromisedRefs: string[] = [],
	affectedEventIds: string[] = []
): DependencyGraphData {
	const nodesMap = new Map<string, DependencyNode>();
	const edges: DependencyEdge[] = [];
	const compromisedValues = new Set<string>(compromisedRefs);
	const compromisedEvents = new Set<string>(affectedEventIds);

	// Also check if any compromisedRefs string corresponds to an event ID directly
	compromisedRefs.forEach((ref) => {
		if (ref.startsWith("evt_")) {
			compromisedEvents.add(ref.replace(/^evt_/, ""));
		} else if (events.some((e) => e.id === ref)) {
			compromisedEvents.add(ref);
		}
	});

	// Pass 1: Build basic nodes and edges, propagate direct event compromise
	events.forEach((evt) => {
		const evtNodeId = `evt_${evt.id}`;
		const isDirectEvtCompromised = compromisedEvents.has(evt.id) || compromisedEvents.has(evtNodeId);

		const isInputCompromised = (evt.inputs || []).some((inp) => compromisedValues.has(inp));
		const isComp = isDirectEvtCompromised || isInputCompromised;

		if (isComp) {
			compromisedEvents.add(evt.id);
		}

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
			const isValComp = compromisedValues.has(inpRef);
			if (!nodesMap.has(inpRef)) {
				nodesMap.set(inpRef, {
					id: inpRef,
					label: inpRef,
					kind: "value",
					isCompromised: isValComp,
				});
			} else if (isValComp) {
				const existing = nodesMap.get(inpRef)!;
				existing.isCompromised = true;
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
			if (isComp) {
				compromisedValues.add(outRef);
			}

			const isNodeCompromised = compromisedValues.has(outRef);
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
		}
	});

	// Pass 2: Transitive closure propagation for downstream nodes
	let changed = true;
	let iterations = 0;
	while (changed && iterations < 10) {
		changed = false;
		iterations++;

		events.forEach((evt) => {
			const evtNodeId = `evt_${evt.id}`;
			const evtNode = nodesMap.get(evtNodeId);

			// If any input is now compromised, mark event node compromised
			const hasCompromisedInput = (evt.inputs || []).some((inp) => compromisedValues.has(inp));
			if (hasCompromisedInput && evtNode && !evtNode.isCompromised) {
				evtNode.isCompromised = true;
				compromisedEvents.add(evt.id);
				changed = true;
			}

			// If event node is compromised, mark its output reference compromised
			const outRef = evt.outputRef || evt.output_ref || (evt.metadata?.outputRef as string);
			if (outRef && evtNode?.isCompromised) {
				if (!compromisedValues.has(outRef)) {
					compromisedValues.add(outRef);
					const valNode = nodesMap.get(outRef);
					if (valNode) valNode.isCompromised = true;
					changed = true;
				}
			}
		});
	}

	return {
		nodes: Array.from(nodesMap.values()),
		edges,
	};
}

