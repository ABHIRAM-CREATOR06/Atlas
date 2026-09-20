import { Eye, Shield, ShieldAlert } from "lucide-react";
import type { ScenarioDefinition } from "../types";

type ThreatOverlayProps = {
	scenario?: ScenarioDefinition;
};

export function ThreatOverlay({ scenario }: ThreatOverlayProps) {
	if (!scenario || scenario.id === "none") return null;

	return (
		<section className="threat-overlay-banner">
			<div className="threat-overlay-head">
				<ShieldAlert size={18} />
				<strong>Active Scenario: {scenario.name}</strong>
			</div>
			<p>{scenario.description}</p>
			<div className="threat-grid">
				<div>
					<span>
						<Eye size={13} /> Attacker Visibility:
					</span>
					<p>{scenario.attackerVisibility}</p>
				</div>
				<div>
					<span>
						<Shield size={13} /> Protected Security Guarantees:
					</span>
					<p>{scenario.protectedProperties.join(", ")}</p>
				</div>
			</div>
		</section>
	);
}
