import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ProtocolDefinition, TraceEvent } from "../types";
import { computeReplayState } from "../lib/replay";

type StateTimelineProps = {
	protocol: ProtocolDefinition;
	events: TraceEvent[];
	canonicalEvents?: TraceEvent[];
	selectedEvent?: TraceEvent;
	onSelect: (event: TraceEvent) => void;
};

export function StateTimeline({
	protocol,
	events,
	canonicalEvents,
	selectedEvent,
	onSelect,
}: StateTimelineProps) {
	const allTraceEvents = canonicalEvents || events;
	const maxTime = Math.max(0, ...allTraceEvents.map((e) => e.t));
	const [currentTime, setCurrentTime] = useState(selectedEvent?.t ?? 0);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		if (selectedEvent) {
			setCurrentTime(selectedEvent.t);
		}
	}, [selectedEvent]);

	useEffect(() => {
		let timer: ReturnType<typeof setInterval>;
		if (isPlaying) {
			timer = setInterval(() => {
				setCurrentTime((prev) => {
					if (prev >= maxTime) {
						setIsPlaying(false);
						return prev;
					}
					const nextEvent = allTraceEvents.find((e) => e.t > prev);
					return nextEvent ? nextEvent.t : prev + 1;
				});
			}, 1200);
		}
		return () => clearInterval(timer);
	}, [allTraceEvents, isPlaying, maxTime]);

	const replayState = computeReplayState(allTraceEvents, protocol, currentTime);

	function handleStep(delta: number) {
		const sortedTs = Array.from(new Set(allTraceEvents.map((e) => e.t))).sort((a, b) => a - b);
		const currentIndex = sortedTs.indexOf(currentTime);
		const targetIndex = Math.max(0, Math.min(sortedTs.length - 1, currentIndex + delta));
		const targetTime = sortedTs[targetIndex] ?? currentTime;
		setCurrentTime(targetTime);
		const matchingEvt = allTraceEvents.find((e) => e.t === targetTime);
		if (matchingEvt) {
			onSelect(matchingEvt);
		}
	}

	return (
		<article className="card visual">
			<div className="panel-heading">
				<div>
					<p className="eyebrow">State timeline</p>
					<h3>Replay & state evolution</h3>
					<p>Scrub through logical timestamp sequence to inspect evolving keys, states, and variables.</p>
				</div>
				<div className="playback-controls">
					<button className="button" onClick={() => handleStep(-1)} aria-label="Previous step">
						<ChevronLeft size={16} />
					</button>
					<button
						className="button primary"
						onClick={() => setIsPlaying(!isPlaying)}
						aria-label={isPlaying ? "Pause playback" : "Play timeline"}
					>
						{isPlaying ? <Pause size={16} /> : <Play size={16} />}
					</button>
					<button className="button" onClick={() => handleStep(1)} aria-label="Next step">
						<ChevronRight size={16} />
					</button>
				</div>
			</div>

			<div className="scrubber-row">
				<span>t=0</span>
				<input
					type="range"
					min={0}
					max={maxTime}
					value={currentTime}
					onChange={(e) => {
						const val = Number(e.target.value);
						setCurrentTime(val);
						const matchingEvt = allTraceEvents.find((evt) => evt.t === val);
						if (matchingEvt) {
							onSelect(matchingEvt);
						}
					}}
					aria-label="Replay timeline scrubber"
				/>
				<span>t={maxTime}</span>
			</div>

			<div className="state-strip" aria-label="Current actor state values">
				{protocol.stateVariables.map((sv) => {
					const val = replayState.currentStateByActor[sv.owner]?.[sv.id] || "uninitialized";
					const isActive = replayState.activeEvent?.actor === sv.owner;
					return (
						<div key={sv.id} className={`state-card ${isActive ? "active" : ""}`}>
							<span>{sv.label}</span>
							<strong>{val}</strong>
						</div>
					);
				})}
			</div>

			<div className="timeline-events-list">
				<h4>Events up to t={currentTime}</h4>
				<ul className="events-cumulative">
					{events
						.filter((e) => e.t <= currentTime)
						.map((e) => (
							<li
								key={e.id}
								className={`timeline-event-item ${e.id === selectedEvent?.id || e.t === currentTime ? "selected" : ""}`}
								role="button"
								tabIndex={0}
								onClick={() => onSelect(e)}
								onKeyDown={(evt) => {
									if (evt.key === "Enter" || evt.key === " ") {
										evt.preventDefault();
										onSelect(e);
									}
								}}
							>
								<span className="mono">t={e.t}</span>
								<strong>[{e.actor}]</strong> {e.label || e.event}
							</li>
						))}
				</ul>
			</div>
		</article>
	);
}

