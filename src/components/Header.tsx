import { Download, FileCode, ShieldCheck, Upload } from "lucide-react";
import type { ProtocolDefinition } from "../types";
import { ProtocolPicker } from "./ProtocolPicker";

type HeaderProps = {
	protocols: ProtocolDefinition[];
	selectedId: string;
	onSelectProtocol: (id: string) => void;
	onOpenImport: () => void;
	onOpenExport: () => void;
};

export function Header({
	protocols,
	selectedId,
	onSelectProtocol,
	onOpenImport,
	onOpenExport,
}: HeaderProps) {
	return (
		<header className="topbar">
			<div className="brand">
				<div className="brand-mark" aria-hidden="true">
					<ShieldCheck size={24} />
				</div>
				<div>
					<p className="eyebrow">Atlas protocol visualizer</p>
					<h1>Protocol replay debugger</h1>
				</div>
			</div>
			<div className="header-actions">
				<ProtocolPicker protocols={protocols} selectedId={selectedId} onSelect={onSelectProtocol} />
				<button className="button" onClick={onOpenImport} aria-label="Import protocol or trace">
					<Upload size={15} style={{ marginRight: 6, verticalAlign: "middle" }} />
					Import trace
				</button>
				<button className="button primary" onClick={onOpenExport} aria-label="Export trace or diagram">
					<Download size={15} style={{ marginRight: 6, verticalAlign: "middle" }} />
					Export
				</button>
			</div>
		</header>
	);
}
