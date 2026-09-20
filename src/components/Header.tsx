import { Compass, Download, Grid, ShieldCheck, Upload } from "lucide-react";
import type { ProtocolDefinition } from "../types";
import { ProtocolPicker } from "./ProtocolPicker";

type HeaderProps = {
	protocols: ProtocolDefinition[];
	selectedId: string;
	onSelectProtocol: (id: string) => void;
	onOpenCatalog: () => void;
	onOpenCompare: () => void;
	onOpenImport: () => void;
	onOpenExport: () => void;
};

export function Header({
	protocols,
	selectedId,
	onSelectProtocol,
	onOpenCatalog,
	onOpenCompare,
	onOpenImport,
	onOpenExport,
}: HeaderProps) {
	return (
		<header className="topbar">
			<div className="brand" onClick={onOpenCatalog} style={{ cursor: "pointer" }}>
				<div className="brand-mark" aria-hidden="true">
					<ShieldCheck size={24} />
				</div>
				<div>
					<p className="eyebrow">Atlas protocol visualizer</p>
					<h1>Protocol replay debugger</h1>
				</div>
			</div>
			<div className="header-actions">
				<button className="button" onClick={onOpenCatalog} title="Browse Protocol Catalog">
					<Grid size={15} style={{ marginRight: 6 }} />
					Catalog
				</button>
				<button className="button" onClick={onOpenCompare} title="Side-by-side Protocol Comparison">
					<Compass size={15} style={{ marginRight: 6 }} />
					Compare
				</button>
				<ProtocolPicker protocols={protocols} selectedId={selectedId} onSelect={onSelectProtocol} />
				<button className="button" onClick={onOpenImport} aria-label="Import protocol or trace">
					<Upload size={15} style={{ marginRight: 6 }} />
					Import
				</button>
				<button className="button primary" onClick={onOpenExport} aria-label="Export trace or diagram">
					<Download size={15} style={{ marginRight: 6 }} />
					Export
				</button>
			</div>
		</header>
	);
}
