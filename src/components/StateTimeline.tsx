import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import type { ProtocolDefinition, TraceEvent } from "../types";
import { isTimelineEvent } from "../lib/trace";

type StateTimelineProps = {
	protocol: ProtocolDefinition;
	events: TraceEvent[];
	selectedEvent?: TraceEvent;
	onSelect: (event: TraceEvent) => void;
};

export function StateTimeline({ protocol, events, selectedEvent, onSelect }: StateTimelineProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const timelineEvents = useMemo(() => events.filter((event) => isTimelineEvent(protocol, event)), [events, protocol]);
	const activeIndex = Math.max(0, timelineEvents.findIndex((event) => event.t === selectedEvent?.t));
	const activeEvent = timelineEvents[activeIndex] ?? timelineEvents[0];

	useEffect(() => {
		if (!svgRef.current) {
			return;
		}

		const width = Math.max(680, timelineEvents.length * 118);
		const height = 180;
		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();
		svg.attr("viewBox", `0 0 ${width} ${height}`);

		const x = d3.scalePoint<number>().domain(timelineEvents.map((_, index) => index)).range([62, width - 62]).padding(0.5);
		svg
			.append("line")
			.attr("x1", 62)
			.attr("x2", width - 62)
			.attr("y1", 82)
			.attr("y2", 82)
			.attr("stroke", "rgba(0,0,0,0.12)")
			.attr("stroke-width", 3);

		timelineEvents.forEach((event, index) => {
			const definition = protocol.stepTypes[event.event];
			const cx = x(index) ?? 62;
			const selected = selectedEvent?.t === event.t;
			const group = svg.append("g").style("cursor", "pointer");
			group
				.append("circle")
				.attr("cx", cx)
				.attr("cy", 82)
				.attr("r", selected ? 18 : 13)
				.attr("fill", definition.color)
				.attr("stroke", selected ? "#000000" : "rgba(0,0,0,0.18)")
				.attr("stroke-width", selected ? 3 : 1.5);
			group
				.append("text")
				.text(event.label ?? definition.label)
				.attr("x", cx)
				.attr("y", 124)
				.attr("text-anchor", "middle")
				.attr("fill", "#000000")
				.attr("font-size", 12)
				.attr("font-weight", 700);
			group
				.append("text")
				.text(`t=${event.t}`)
				.attr("x", cx)
				.attr("y", 145)
				.attr("text-anchor", "middle")
				.attr("fill", "#78736F")
				.attr("font-size", 11);
			group.on("click", () => onSelect(event));
		});
	}, [onSelect, protocol, selectedEvent, timelineEvents]);

	if (!protocol.views.includes("stateTimeline")) {
		return (
			<section className="visual-panel">
				<div className="panel-title">
					<p className="eyebrow">State timeline</p>
					<h2>Not declared</h2>
				</div>
				<p className="muted">This protocol definition declares only the sequence view.</p>
			</section>
		);
	}

	return (
		<section className="visual-panel">
			<div className="panel-title">
				<p className="eyebrow">State timeline</p>
				<h2>Ratchet state replay</h2>
			</div>
			<div className="svg-scroll compact">
				<svg ref={svgRef} role="img" aria-label={`${protocol.name} state timeline`} />
			</div>
			<input
				className="scrubber"
				type="range"
				min={0}
				max={Math.max(0, timelineEvents.length - 1)}
				value={activeIndex}
				onChange={(event) => onSelect(timelineEvents[Number(event.target.value)])}
				aria-label="Timeline scrubber"
			/>
			<div className="state-grid">
				{protocol.statePanels.map((panel) => {
					const state = activeEvent?.actor === panel.actor ? activeEvent.state : undefined;
					return (
						<div className="state-panel" key={panel.id}>
							<span>{panel.label}</span>
							<strong>{state?.[panel.field] ?? "unchanged"}</strong>
						</div>
					);
				})}
			</div>
		</section>
	);
}
