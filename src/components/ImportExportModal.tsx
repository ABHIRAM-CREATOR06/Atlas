import { useState } from "react";
import { AlertTriangle, CheckCircle, Download, FileText, Image, Upload, X } from "lucide-react";
import type { ProtocolDefinition, TraceDiagnostic } from "../types";
import { parseTrace } from "../lib/trace";

type ImportExportModalProps = {
	mode: "import" | "export";
	isOpen: boolean;
	onClose: () => void;
	protocol: ProtocolDefinition;
	currentTraceJsonl: string;
	onImportSuccess: (protocolDef?: ProtocolDefinition, traceJsonl?: string) => void;
};

export function ImportExportModal({
	mode,
	isOpen,
	onClose,
	protocol,
	currentTraceJsonl,
	onImportSuccess,
}: ImportExportModalProps) {
	const [pastedText, setPastedText] = useState("");
	const [importDiagnostics, setImportDiagnostics] = useState<TraceDiagnostic[]>([]);
	const [previewValid, setPreviewValid] = useState<boolean | null>(null);

	if (!isOpen) return null;

	function handleValidatePreview() {
		if (!pastedText.trim()) return;
		const res = parseTrace(pastedText, protocol);
		setImportDiagnostics(res.diagnostics);
		setPreviewValid(res.errors.length === 0);
	}

	function handleConfirmImport() {
		if (!pastedText.trim()) return;
		onImportSuccess(undefined, pastedText);
		onClose();
	}

	function handleDownloadTrace() {
		const blob = new Blob([currentTraceJsonl], { type: "application/x-jsonlines" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${protocol.id}_trace.jsonl`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleDownloadProtocolDef() {
		const blob = new Blob([JSON.stringify(protocol, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${protocol.id}_definition.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleDownloadSvgDiagram() {
		const svgEl = document.querySelector("svg.diagram");
		if (!svgEl) {
			alert("No active sequence diagram available to export.");
			return;
		}
		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(svgEl);
		const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${protocol.id}_sequence_diagram.svg`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleDownloadTranscript() {
		const validation = parseTrace(currentTraceJsonl, protocol);
		const lines: string[] = [
			`# Transcript: ${protocol.name}`,
			`Protocol Category: ${protocol.category}`,
			`Description: ${protocol.description}`,
			`Generated: ${new Date().toISOString()}`,
			"",
			"## Trace Events",
			"",
		];

		validation.events.forEach((evt) => {
			lines.push(`### t=${evt.t} · ${evt.label || evt.event}`);
			lines.push(`- **Actor**: ${evt.actor}`);
			if (evt.from) lines.push(`- **Route**: ${evt.from} ➔ ${evt.to}`);
			if (evt.phase) lines.push(`- **Phase**: ${evt.phase}`);
			if (evt.inputs && evt.inputs.length > 0) lines.push(`- **Inputs**: \`${evt.inputs.join(", ")}\``);
			if (evt.outputRef || evt.output_ref) lines.push(`- **Output**: \`${evt.outputRef || evt.output_ref}\``);
			lines.push("");
		});

		const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${protocol.id}_transcript.md`;
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="modal-backdrop" onClick={onClose}>
			<div className="modal-card" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h3>{mode === "import" ? "Import Protocol or Trace" : "Export Workspace Artifacts"}</h3>
					<button className="button quiet" onClick={onClose} aria-label="Close dialog">
						<X size={18} />
					</button>
				</div>

				<div className="modal-body">
					{mode === "import" ? (
						<div className="import-container">
							<p className="modal-desc">
								Paste a JSONL trace or JSON protocol definition below. Atlas parses and validates all timestamp, reference, and route constraints locally in your browser.
							</p>

							<textarea
								className="modal-textarea"
								rows={8}
								placeholder='Paste JSONL trace lines e.g. {"id":"evt_1","t":0,"actor":"Alice","event":"FetchPrekeyBundle"}'
								value={pastedText}
								onChange={(e) => setPastedText(e.target.value)}
							/>

							<div className="modal-actions-row">
								<button className="button" onClick={handleValidatePreview}>
									Preview & Validate
								</button>
								{previewValid !== null && (
									<button className="button primary" onClick={handleConfirmImport}>
										Load Trace into Workspace
									</button>
								)}
							</div>

							{previewValid !== null && (
								<div className={`validation-preview-box ${previewValid ? "success" : "warning"}`}>
									<strong>
										{previewValid ? (
											<span>
												<CheckCircle size={14} /> Validation Passed
											</span>
										) : (
											<span>
												<AlertTriangle size={14} /> Validation Warnings/Errors Found
											</span>
										)}
									</strong>
									<ul className="diag-preview-list">
										{importDiagnostics.map((d, i) => (
											<li key={i} className={d.severity}>
												[{d.severity.toUpperCase()}] {d.message}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					) : (
						<div className="export-container">
							<p className="modal-desc">
								Export your current trace workspace as sanitized JSONL, protocol definition JSON, SVG diagram, or markdown explanation transcript.
							</p>

							<div className="export-options-grid">
								<button className="button" onClick={handleDownloadTrace}>
									<Download size={16} style={{ marginRight: 6 }} /> Download Trace (.jsonl)
								</button>
								<button className="button" onClick={handleDownloadProtocolDef}>
									<FileText size={16} style={{ marginRight: 6 }} /> Download Protocol (.json)
								</button>
								<button className="button" onClick={handleDownloadSvgDiagram}>
									<Image size={16} style={{ marginRight: 6 }} /> Download SVG Diagram
								</button>
								<button className="button" onClick={handleDownloadTranscript}>
									<FileText size={16} style={{ marginRight: 6 }} /> Download Transcript (.md)
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
