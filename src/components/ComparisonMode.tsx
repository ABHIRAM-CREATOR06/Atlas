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

	return (
		<section className="comparison-section">
			<div className="comparison-header">
				<div>
					<p className="eyebrow">Protocol Comparison Mode</p>
					<h2>Side-by-Side Protocol Feature & Trade-Off Analysis</h2>
					<p>Compare communication architecture, delivery guarantees, security properties, and state overheads.</p>
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
		</section>
	);
}
