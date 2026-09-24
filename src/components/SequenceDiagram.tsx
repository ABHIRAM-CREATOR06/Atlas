import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import type { ProtocolDefinition, TraceEvent } from "../types";
import { isSequenceEvent } from "../lib/trace";

type SequenceDiagramProps = {
	protocol: ProtocolDefinition;
	events: TraceEvent[];
	selectedEvent?: TraceEvent;
	onSelect: (event: TraceEvent) => void;
};

export function SequenceDiagram({ protocol, events, selectedEvent, onSelect }: SequenceDiagramProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const sequenceEvents = useMemo(
		() => events.filter((event) => isSequenceEvent(protocol, event)),
		[events, protocol]
	);

	useEffect(() => {
		if (!svgRef.current) {
			return;
		}

		const actorX = new Map(protocol.actors.map((actor, index) => [actor.id, 140 + index * 280]));
		const width = Math.max(820, 200 + Math.max(1, protocol.actors.length - 1) * 280);
		const height = Math.max(480, 150 + sequenceEvents.length * 72);
		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();
		svg.attr("viewBox", `0 0 ${width} ${height}`);

		// Define markers for arrows
		const defs = svg.append("defs");
		const colors = ["#2878c8", "#188477", "#8152b8", "#b66a16", "#b42318", "#171717"];

		colors.forEach((color) => {
			const safeId = `arrow-${color.replace("#", "")}`;
			defs
				.append("marker")
				.attr("id", safeId)
				.attr("viewBox", "0 -5 10 10")
				.attr("refX", 8)
				.attr("refY", 0)
				.attr("markerWidth", 7)
				.attr("markerHeight", 7)
				.attr("orient", "auto")
				.append("path")
				.attr("d", "M0,-5L10,0L0,5Z")
				.attr("fill", color);
		});

		// Render phase background bands
		let currentPhase = "";

		sequenceEvents.forEach((evt, idx) => {
			const evtPhase = evt.phase || "default";
			const y = 120 + idx * 72;

			if (evtPhase !== currentPhase) {
				if (currentPhase !== "" && idx > 0) {
					svg
						.append("line")
						.attr("x1", 30)
						.attr("x2", width - 30)
						.attr("y1", y - 36)
						.attr("y2", y - 36)
						.attr("stroke", "#e4e1dc")
						.attr("stroke-dasharray", "2 4");
				}

				const phaseObj = protocol.phases.find((p) => p.id === evtPhase);
				const phaseLabel = phaseObj ? phaseObj.label : evtPhase;

				svg
					.append("text")
					.text(phaseLabel.toUpperCase())
					.attr("x", 40)
					.attr("y", y - 42)
					.attr("fill", "#918c86")
					.attr("font-size", 10.5)
					.attr("font-weight", 800)
					.attr("letter-spacing", "0.08em");

				currentPhase = evtPhase;
			}
		});

		// Render Actor lifelines and headers
		protocol.actors.forEach((actor) => {
			const x = actorX.get(actor.id) ?? 140;
			svg
				.append("line")
				.attr("x1", x)
				.attr("x2", x)
				.attr("y1", 76)
				.attr("y2", height - 32)
				.attr("stroke", "#c9c4bd")
				.attr("stroke-dasharray", "4 7");

			const header = svg.append("g").attr("transform", `translate(${x}, 42)`);
			header.append("circle").attr("r", 20).attr("fill", actor.color);
			header
				.append("text")
				.text(actor.label.charAt(0))
				.attr("text-anchor", "middle")
				.attr("y", 6)
				.attr("fill", "#ffffff")
				.attr("font-size", 15)
				.attr("font-weight", 800);

			header
				.append("text")
				.text(actor.label)
				.attr("text-anchor", "middle")
				.attr("y", 36)
				.attr("fill", "#171717")
				.attr("font-size", 13)
				.attr("font-weight", 700);
		});

		// Render Message & Operation events
		sequenceEvents.forEach((event, index) => {
			const msgDef = protocol.messages?.[event.event];
			const opDef = protocol.operationTypes?.[event.event];
			const labelColor = msgDef?.color || opDef?.color || "#2878c8";
			const y = 120 + index * 72;

			const fallbackX = actorX.get(event.actor) ?? 140;
			const fromX = actorX.get(String(event.from ?? event.actor)) ?? fallbackX;
			const toX = actorX.get(String(event.to ?? event.actor)) ?? fromX + 180;
			const isSelf = fromX === toX;
			const isSelected = selectedEvent?.id === event.id || selectedEvent?.t === event.t;

			const group = svg
				.append("g")
				.attr("class", `sequence-hit ${isSelected ? "selected" : ""}`)
				.attr("tabindex", 0)
				.attr("role", "button")
				.attr("aria-label", `Event t=${event.t}: ${event.label || event.event}`)
				.attr("data-testid", `event-row-${event.id}`)
				.style("cursor", "pointer");

			const markerId = `url(#arrow-${labelColor.replace("#", "")})`;

			if (isSelf) {
				group
					.append("path")
					.attr("d", `M${fromX},${y} C${fromX + 96},${y - 30} ${fromX + 96},${y + 30} ${fromX},${y + 20}`)
					.attr("fill", "none")
					.attr("stroke", labelColor)
					.attr("stroke-width", isSelected ? 3.5 : 2.2)
					.attr("marker-end", markerId);
			} else {
				group
					.append("line")
					.attr("x1", fromX)
					.attr("x2", toX)
					.attr("y1", y)
					.attr("y2", y)
					.attr("stroke", labelColor)
					.attr("stroke-width", isSelected ? 3.5 : 2.4)
					.attr("stroke-dasharray", event.event.includes("ACK") || event.status === "delayed" ? "5 5" : "none")
					.attr("marker-end", markerId);
			}

			const labelX = isSelf ? fromX + 100 : (fromX + toX) / 2;
			const displayLabel = event.label || msgDef?.label || opDef?.label || event.event;
			const labelWidth = Math.max(150, displayLabel.length * 8.5 + 24);

			group
				.append("rect")
				.attr("x", labelX - labelWidth / 2)
				.attr("y", y - 27)
				.attr("width", labelWidth)
				.attr("height", 30)
				.attr("rx", 6)
				.attr("fill", isSelected ? "#1769d2" : "#ffffff")
				.attr("stroke", isSelected ? "#0d4fa8" : "#e4e1dc")
				.attr("stroke-width", isSelected ? 2 : 1);

			group
				.append("text")
				.text(displayLabel)
				.attr("x", labelX)
				.attr("y", y - 7)
				.attr("text-anchor", "middle")
				.attr("fill", isSelected ? "#ffffff" : "#171717")
				.attr("font-size", 12.5)
				.attr("font-weight", 700);

			// Add timestamp badge
			group
				.append("text")
				.text(`t=${event.t}`)
				.attr("x", fromX < toX ? fromX - 12 : fromX + 12)
				.attr("y", y + 4)
				.attr("text-anchor", fromX < toX ? "end" : "start")
				.attr("fill", "#6f6b66")
				.attr("font-size", 10.5)
				.attr("font-family", "monospace");

			group.append("title").text(`t=${event.t} [${event.actor}]: ${displayLabel}`);
			group.on("click", () => onSelect(event));
			group.on("keydown", (e: KeyboardEvent) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect(event);
				}
			});
		});
	}, [onSelect, protocol, selectedEvent, sequenceEvents]);

	return (
		<article className="card visual">
			<div className="panel-heading">
				<div>
					<p className="eyebrow">Sequence diagram</p>
					<h3>Operation flow</h3>
					<p>Click a message arrow to inspect parameters, cryptographic operations, and state changes.</p>
				</div>
				<div className="legend" aria-label="Diagram legend">
					<span className="legend-item">
						<i className="legend-dot" style={{ background: "var(--blue)" }} />
						Crypto
					</span>
					<span className="legend-item">
						<i className="legend-dot" style={{ background: "var(--teal)" }} />
						Message
					</span>
					<span className="legend-item">
						<i className="legend-dot" style={{ background: "var(--purple)" }} />
						State
					</span>
				</div>
			</div>

			<div className="diagram-wrap">
				<svg ref={svgRef} className="diagram" role="group" aria-label={`${protocol.name} sequence diagram`} />
			</div>
		</article>
	);
}
