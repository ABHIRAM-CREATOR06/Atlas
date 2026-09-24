import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Download, FileText, Image, ShieldCheck, Upload, X } from "lucide-react";
import type { ProtocolDefinition, TraceDiagnostic } from "../types";
import { parseTrace, sanitizeTraceJsonl } from "../lib/trace";
import { validateProtocolDefinition } from "../lib/schema";

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
	const [previewType, setPreviewType] = useState<"trace" | "protocol" | null>(null);
	const [importedProtoDef, setImportedProtoDef] = useState<ProtocolDefinition | undefined>();

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	function handleValidatePreview() {
		const trimmed = pastedText.trim();
		if (!trimmed) return;

		setImportDiagnostics([]);
		setPreviewValid(null);
		setPreviewType(null);
		setImportedProtoDef(undefined);

		// Try parsing as JSON object (Protocol Definition) first
		if (trimmed.startsWith("{")) {
			try {
				const obj = JSON.parse(trimmed);
				const { valid, diagnostics: protoDiags } = validateProtocolDefinition(obj);
				if (valid || protoDiags.length === 0 || obj.actors) {
					setImportedProtoDef(obj as ProtocolDefinition);
					setImportDiagnostics(protoDiags);
					setPreviewValid(valid);
					setPreviewType("protocol");
					return;
				}
			} catch {
				// Not a valid single JSON object, fall back to JSONL trace parsing below
			}
		}

		// Parse as JSONL trace lines
		const res = parseTrace(trimmed, protocol);
		setImportDiagnostics(res.diagnostics);
		setPreviewValid(res.errors.length === 0);
		setPreviewType("trace");
	}

	function handleConfirmImport() {
		if (!pastedText.trim()) return;

		if (previewType === "protocol" && importedProtoDef) {
			onImportSuccess(importedProtoDef, undefined);
		} else {
			onImportSuccess(undefined, pastedText);
		}
		onClose();
	}

	function handleDownloadSanitizedTrace() {
		const sanitizedJsonl = sanitizeTraceJsonl(currentTraceJsonl, protocol);
		const blob = new Blob([sanitizedJsonl], { type: "application/x-jsonlines" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${protocol.id}_sanitized_trace.jsonl`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleDownloadRawTrace() {
		const blob = new Blob([currentTraceJsonl], { type: "application/x-jsonlines" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${protocol.id}_raw_trace.jsonl`;
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
			"## Trace Events (Sanitized)",
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
		<div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
			<div className="modal-card" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h3 id="modal-title">{mode === "import" ? "Import Protocol or Trace" : "Export Workspace Artifacts"}</h3>
					<button className="button quiet" onClick={onClose} aria-label="Close dialog">
						<X size={18} />
					</button>
				</div>

				<div className="modal-body">
					{mode === "import" ? (
						<div className="import-container">
							<p className="modal-desc">
								Paste a JSONL trace or JSON protocol definition below. Atlas parses and validates all timestamp, reference, actor, and schema constraints locally in your browser.
							</p>

							<textarea
								className="modal-textarea"
								rows={8}
								placeholder='Paste JSONL trace lines e.g. {"id":"evt_1","t":0,"actor":"Alice","event":"FetchPrekeyBundle"} OR JSON protocol definition object e.g. {"id":"custom-proto","name":"My Protocol","actors":[...]}'
								value={pastedText}
								onChange={(e) => setPastedText(e.target.value)}
								aria-label="Import content textarea"
							/>

							<div className="modal-actions-row">
								<button className="button" onClick={handleValidatePreview}>
									Preview & Validate
								</button>
								{previewValid !== null && (
									<button className="button primary" onClick={handleConfirmImport}>
										{previewType === "protocol" ? "Register Custom Protocol" : "Load Trace into Workspace"}
									</button>
								)}
							</div>

							{previewValid !== null && (
								<div className={`validation-preview-box ${previewValid ? "success" : "warning"}`}>
									<strong>
										{previewValid ? (
											<span>
												<CheckCircle size={14} /> Validation Passed ({previewType === "protocol" ? "Protocol Definition" : "Trace JSONL"})
											</span>
										) : (
											<span>
												<AlertTriangle size={14} /> Validation Diagnostics ({previewType === "protocol" ? "Protocol Definition" : "Trace JSONL"})
											</span>
										)}
									</strong>
									<ul className="diag-preview-list">
										{importDiagnostics.length === 0 ? (
											<li className="info">[INFO] Clean validation with no errors or warnings.</li>
										) : (
											importDiagnostics.map((d, i) => (
												<li key={i} className={d.severity}>
													[{d.severity.toUpperCase()}]{d.line ? ` Line ${d.line}:` : ""} {d.message}
												</li>
											))
										)}
									</ul>
								</div>
							)}
						</div>
					) : (
						<div className="export-container">
							<p className="modal-desc">
								Export your current trace workspace as sanitized JSONL (privacy safe), raw JSONL, protocol definition JSON, SVG diagram, or markdown transcript.
							</p>

							<div className="export-options-grid">
								<button className="button primary" onClick={handleDownloadSanitizedTrace}>
									<ShieldCheck size={16} style={{ marginRight: 6 }} /> Sanitized Trace (.jsonl)
								</button>
								<button className="button" onClick={handleDownloadRawTrace}>
									<Download size={16} style={{ marginRight: 6 }} /> Raw Trace (.jsonl)
								</button>
								<button className="button" onClick={handleDownloadProtocolDef}>
									<FileText size={16} style={{ marginRight: 6 }} /> Protocol Definition (.json)
								</button>
								<button className="button" onClick={handleDownloadSvgDiagram}>
									<Image size={16} style={{ marginRight: 6 }} /> SVG Diagram
								</button>
								<button className="button" onClick={handleDownloadTranscript}>
									<FileText size={16} style={{ marginRight: 6 }} /> Markdown Transcript (.md)
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

