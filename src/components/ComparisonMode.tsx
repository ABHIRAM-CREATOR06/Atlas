import { useState } from "react";
import { ArrowLeftRight, Check, X } from "lucide-react";
import type { ProtocolDefinition } from "../types";

type ComparisonModeProps = {
	protocols: ProtocolDefinition[];
	initialProtoAId?: string;
	onClose: () => void;
	onSelectProtocol: (id: string) => void;
};

export function ComparisonMode({
	protocols,
	initialProtoAId,
	onClose,
	onSelectProtocol,
}: ComparisonModeProps) {
	const [protoAId, setProtoAId] = useState(initialProtoAId || protocols[0].id);
	const [protoBId, setProtoBId] = useState(
		protocols.find((p) => p.id !== (initialProtoAId || protocols[0].id))?.id || protocols[1].id
	);

	const protoA = protocols.find((p) => p.id === protoAId) || protocols[0];
	const protoB = protocols.find((p) => p.id === protoBId) || protocols[1];

	const compA = protoA.comparisonDetails;
	const compB = protoB.comparisonDetails;

	const matrixRows = [
		{
			title: "Layer & Transport",
			valA: compA?.layerAndTransport || protoA.category,
			valB: compB?.layerAndTransport || protoB.category,
		},
		{
			title: "Delivery & Ordering Guarantees",
			valA: compA?.deliveryGuarantees || "In-order delivery per stream / connection",
			valB: compB?.deliveryGuarantees || "In-order delivery per stream / connection",
		},
		{
			title: "Multiplexing",
			valA: compA?.multiplexing || "Single connection multiplexing",
			valB: compB?.multiplexing || "Single connection multiplexing",
		},
		{
			title: "Statefulness & Connection Overhead",
			valA: compA?.statefulness || "Stateful connection context",
			valB: compB?.statefulness || "Stateful connection context",
		},
		{
			title: "Security Model & Trust",
			valA: compA?.securityModel || (protoA.securityProperties?.map((s) => s.name).join(", ") || "Declared security model"),
			valB: compB?.securityModel || (protoB.securityProperties?.map((s) => s.name).join(", ") || "Declared security model"),
		},
		{
			title: "Latency & RTT Profile",
			valA: compA?.latencyProfile || "Standard network round trips",
			valB: compB?.latencyProfile || "Standard network round trips",
		},
		{
			title: "Failure & Recovery Model",
			valA: compA?.failureRecovery || (protoA.failureModes?.[0]?.description || "Explicit error responses & retry"),
			valB: compB?.failureRecovery || (protoB.failureModes?.[0]?.description || "Explicit error responses & retry"),
		},
		{
			title: "Operational Complexity",
			valA: compA?.complexity || `${protoA.difficulty || "Intermediate"} complexity`,
			valB: compB?.complexity || `${protoB.difficulty || "Intermediate"} complexity`,
		},
	];

	return (
		<section className="comparison-section">
			<div className="comparison-header">
				<div>
					<p className="eyebrow">Protocol Comparison Mode</p>
					<h2>Side-by-Side Protocol Feature & Trade-Off Analysis</h2>
					<p>Compare communication architecture, delivery guarantees, security properties, and operational overheads.</p>
				</div>
				<button className="button" onClick={onClose}>
					Back to Catalog
				</button>
			</div>

			<div className="comparison-selectors">
				<div className="selector-box">
					<label>Protocol A</label>
					<select value={protoAId} onChange={(e) => setProtoAId(e.target.value)}>
						{protocols.map((p) => (
							<option key={p.id} value={p.id}>
								{p.name} ({p.category})
							</option>
						))}
					</select>
				</div>

				<ArrowLeftRight size={24} className="swap-icon" />

				<div className="selector-box">
					<label>Protocol B</label>
					<select value={protoBId} onChange={(e) => setProtoBId(e.target.value)}>
						{protocols.map((p) => (
							<option key={p.id} value={p.id}>
								{p.name} ({p.category})
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="comparison-grid">
				<article className="card comp-card">
					<h3>{protoA.name}</h3>
					<span className="cat-badge">{protoA.category}</span>
					<p>{protoA.description}</p>
					<dl className="field-list">
						<div className="field"><dt>Actors</dt><dd>{protoA.actors.map((a) => a.label).join(", ")}</dd></div>
						<div className="field"><dt>Phases</dt><dd>{protoA.phases.map((p) => p.label).join(" → ")}</dd></div>
						<div className="field"><dt>Security</dt><dd>{protoA.securityProperties?.map((s) => s.name).join(", ") || "None declared"}</dd></div>
					</dl>
					<button className="button primary" style={{ marginTop: 16 }} onClick={() => onSelectProtocol(protoA.id)}>
						Open {protoA.name}
					</button>
				</article>

				<article className="card comp-card">
					<h3>{protoB.name}</h3>
					<span className="cat-badge">{protoB.category}</span>
					<p>{protoB.description}</p>
					<dl className="field-list">
						<div className="field"><dt>Actors</dt><dd>{protoB.actors.map((a) => a.label).join(", ")}</dd></div>
						<div className="field"><dt>Phases</dt><dd>{protoB.phases.map((p) => p.label).join(" → ")}</dd></div>
						<div className="field"><dt>Security</dt><dd>{protoB.securityProperties?.map((s) => s.name).join(", ") || "None declared"}</dd></div>
					</dl>
					<button className="button primary" style={{ marginTop: 16 }} onClick={() => onSelectProtocol(protoB.id)}>
						Open {protoB.name}
					</button>
				</article>
			</div>

			<div className="comparison-table-card card" style={{ marginTop: 24, padding: 24 }}>
				<h3>Detailed Technical Matrix: {protoA.name} vs {protoB.name}</h3>
				<table className="comparison-table" style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
					<thead>
						<tr style={{ textAlign: "left", borderBottom: "2px solid var(--border)" }}>
							<th style={{ padding: "10px 14px", width: "22%" }}>Dimension</th>
							<th style={{ padding: "10px 14px", width: "39%" }}>{protoA.name}</th>
							<th style={{ padding: "10px 14px", width: "39%" }}>{protoB.name}</th>
						</tr>
					</thead>
					<tbody>
						{matrixRows.map((row, idx) => (
							<tr key={idx} style={{ borderBottom: "1px solid var(--border-light, #f0ede8)" }}>
								<td style={{ padding: "12px 14px", fontWeight: 700, fontSize: "0.9rem" }}>{row.title}</td>
								<td style={{ padding: "12px 14px", fontSize: "0.88rem" }}>{row.valA}</td>
								<td style={{ padding: "12px 14px", fontSize: "0.88rem" }}>{row.valB}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}

