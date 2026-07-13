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
	const sequenceEvents = useMemo(() => events.filter((event) => isSequenceEvent(protocol, event)), [events, protocol]);

	useEffect(() => {
		if (!svgRef.current) {
			return;
		}

		const actorX = new Map(protocol.actors.map((actor, index) => [actor.id, 90 + index * 220]));
		const width = Math.max(620, 180 + Math.max(1, protocol.actors.length - 1) * 220);
		const height = Math.max(420, 130 + sequenceEvents.length * 58);
		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();
		svg.attr("viewBox", `0 0 ${width} ${height}`);

		const defs = svg.append("defs");
		defs
			.append("marker")
			.attr("id", "arrow-head")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 8)
			.attr("refY", 0)
			.attr("markerWidth", 7)
			.attr("markerHeight", 7)
			.attr("orient", "auto")
			.append("path")
			.attr("d", "M0,-5L10,0L0,5")
			.attr("fill", "#000000");

		protocol.actors.forEach((actor) => {
			const x = actorX.get(actor.id) ?? 90;
			svg
				.append("line")
				.attr("x1", x)
				.attr("x2", x)
				.attr("y1", 76)
				.attr("y2", height - 28)
				.attr("stroke", "rgba(0,0,0,0.14)")
				.attr("stroke-dasharray", "5 7");

			const header = svg.append("g").attr("transform", `translate(${x}, 34)`);
			header.append("circle").attr("r", 18).attr("fill", actor.color).attr("opacity", 0.95);
			header
				.append("text")
				.text(actor.label)
				.attr("text-anchor", "middle")
				.attr("y", 45)
				.attr("fill", "#000000")
				.attr("font-size", 13)
				.attr("font-weight", 700);
		});

		sequenceEvents.forEach((event, index) => {
			const definition = protocol.operationTypes[event.event];
			const y = 104 + index * 58;
			const fallbackX = actorX.get(event.actor) ?? 90;
			const fromX = actorX.get(String(event.from ?? event.actor)) ?? fallbackX;
			const toX = actorX.get(String(event.to ?? event.actor)) ?? fromX + 118;
			const isSelf = fromX === toX;
			const selected = selectedEvent?.t === event.t;
			const group = svg.append("g").attr("class", "sequence-hit").style("cursor", "pointer");

			if (isSelf) {
				group
					.append("path")
					.attr("d", `M${fromX},${y} C${fromX + 84},${y - 28} ${fromX + 84},${y + 28} ${fromX},${y + 18}`)
					.attr("fill", "none")
					.attr("stroke", definition.color)
					.attr("stroke-width", selected ? 4 : 2.5)
					.attr("marker-end", "url(#arrow-head)");
			} else {
				group
					.append("line")
					.attr("x1", fromX)
					.attr("x2", toX)
					.attr("y1", y)
					.attr("y2", y)
					.attr("stroke", definition.color)
					.attr("stroke-width", selected ? 4 : 2.5)
					.attr("marker-end", "url(#arrow-head)");
			}

			const labelX = isSelf ? fromX + 86 : (fromX + toX) / 2;
			group
				.append("rect")
				.attr("x", labelX - 64)
				.attr("y", y - 25)
				.attr("width", 128)
				.attr("height", 28)
				.attr("rx", 6)
				.attr("fill", selected ? "#097FE8" : "#FFFFFF")
				.attr("stroke", selected ? "#0062B1" : "#E0DCDA");

			group
				.append("text")
				.text(event.label ?? definition.label)
				.attr("x", labelX)
				.attr("y", y - 7)
				.attr("text-anchor", "middle")
				.attr("fill", selected ? "#FFFFFF" : "#000000")
				.attr("font-size", 12)
				.attr("font-weight", 700);

			group.append("title").text(`${definition.label}: ${event.output_ref ?? "no output"}`);
			group.on("click", () => onSelect(event));
		});
	}, [onSelect, protocol, selectedEvent, sequenceEvents]);

	return (
		<section className="visual-panel">
			<div className="panel-title">
				<p className="eyebrow">Sequence diagram</p>
				<h2>Operation flow</h2>
			</div>
			<div className="svg-scroll">
				<svg ref={svgRef} role="img" aria-label={`${protocol.name} sequence diagram`} />
			</div>
		</section>
	);
}
