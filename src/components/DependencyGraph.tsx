import { useMemo } from "react";
import type { TraceEvent } from "../types";
import { buildDependencyGraph } from "../lib/dependency";

type DependencyGraphProps = {
	events: TraceEvent[];
	compromisedRefs?: string[];
	onSelectEvent?: (event: TraceEvent) => void;
};

export function DependencyGraph({ events, compromisedRefs = [], onSelectEvent }: DependencyGraphProps) {
	const graph = useMemo(() => buildDependencyGraph(events, compromisedRefs), [events, compromisedRefs]);

	return (
		<article className="card visual">
			<div className="panel-heading">
				<div>
					<p className="eyebrow">Dependency graph</p>
					<h3>Value provenance & crypto dependencies</h3>
					<p>Visualize cryptographic value derivations, inputs, outputs, and potential blast radiuses.</p>
				</div>
			</div>

			<div className="dep-graph-container">
				<div className="dep-nodes-list">
					{graph.nodes.map((node) => (
						<div
							key={node.id}
							className={`dep-node-card ${node.kind} ${node.isCompromised ? "compromised" : ""}`}
						>
							<span className="node-kind">{node.kind}</span>
							<strong>{node.label}</strong>
							{node.t !== undefined && <span className="mono">t={node.t}</span>}
						</div>
					))}
				</div>

				<div className="dep-edges-list">
					<h4>Edges ({graph.edges.length})</h4>
					<ul>
						{graph.edges.map((edge, i) => (
							<li key={i} className="dep-edge-item">
								<span className="mono">{edge.from}</span>
								<span className="arrow">➔</span>
								<span className="mono">{edge.to}</span>
								<small>({edge.label})</small>
							</li>
						))}
					</ul>
				</div>
			</div>
		</article>
	);
}
