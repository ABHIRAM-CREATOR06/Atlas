import type { ProtocolDefinition, TraceDiagnostic, TraceEvent } from "../types";

type ProtocolSummaryProps = {
	protocol: ProtocolDefinition;
	events: TraceEvent[];
	diagnostics: TraceDiagnostic[];
};

export function ProtocolSummary({ protocol, events, diagnostics }: ProtocolSummaryProps) {
	const errorsCount = diagnostics.filter((d) => d.severity === "error").length;
	const warningCount = diagnostics.filter((d) => d.severity === "warning").length;

	return (
		<section className="summary" aria-labelledby="protocol-title">
			<div>
				<p className="eyebrow">
					{protocol.category} · version {protocol.version}
				</p>
				<h2 id="protocol-title">{protocol.name}</h2>
				<p>{protocol.description}</p>
				<div className="summary-meta">
					{errorsCount === 0 ? (
						<span className="status success">
							<i className="dot" /> Trace valid
						</span>
					) : (
						<span className="status danger">
							<i className="dot" /> {errorsCount} verification errors
						</span>
					)}
					{warningCount > 0 && (
						<span className="status warning">
							<i className="dot" /> {warningCount} advisories
						</span>
					)}
				</div>
			</div>
			<div className="metrics" aria-label="Protocol summary metrics">
				<div className="metric">
					<strong>{protocol.actors.length}</strong>
					<span>Actors</span>
				</div>
				<div className="metric">
					<strong>{events.length}</strong>
					<span>Events</span>
				</div>
				<div className="metric">
					<strong>{protocol.phases.length}</strong>
					<span>Phases</span>
				</div>
			</div>
		</section>
	);
}
