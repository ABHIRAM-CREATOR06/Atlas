import { Activity, BookOpen, Braces, GitMerge, Search, ShieldAlert, Sliders } from "lucide-react";
import type { ProtocolDefinition, ScenarioDefinition, ViewId } from "../types";

type ToolbarProps = {
	protocol: ProtocolDefinition;
	activeView: ViewId;
	onSelectView: (view: ViewId) => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	selectedActor: string;
	onSelectActor: (actor: string) => void;
	selectedPhase: string;
	onSelectPhase: (phase: string) => void;
	scenariosList: ScenarioDefinition[];
	selectedScenarioId: string;
	onSelectScenario: (scenarioId: string) => void;
};

export function Toolbar({
	protocol,
	activeView,
	onSelectView,
	searchQuery,
	onSearchChange,
	selectedActor,
	onSelectActor,
	selectedPhase,
	onSelectPhase,
	scenariosList,
	selectedScenarioId,
	onSelectScenario,
}: ToolbarProps) {
	return (
		<div className="toolbar">
			<nav className="tabs" aria-label="Protocol views">
				{protocol.views.includes("sequenceDiagram") && (
					<button
						className={`tab ${activeView === "sequenceDiagram" ? "active" : ""}`}
						onClick={() => onSelectView("sequenceDiagram")}
					>
						<Braces size={15} />
						Sequence
					</button>
				)}
				{protocol.views.includes("stateTimeline") && (
					<button
						className={`tab ${activeView === "stateTimeline" ? "active" : ""}`}
						onClick={() => onSelectView("stateTimeline")}
					>
						<Activity size={15} />
						Timeline
					</button>
				)}
				{protocol.views.includes("stateMachine") && (
					<button
						className={`tab ${activeView === "stateMachine" ? "active" : ""}`}
						onClick={() => onSelectView("stateMachine")}
					>
						<GitMerge size={15} />
						State Machine
					</button>
				)}
				{protocol.views.includes("dependencyGraph") && (
					<button
						className={`tab ${activeView === "dependencyGraph" ? "active" : ""}`}
						onClick={() => onSelectView("dependencyGraph")}
					>
						<Sliders size={15} />
						Dependencies
					</button>
				)}
				{protocol.views.includes("guidedWalkthrough") && (
					<button
						className={`tab ${activeView === "guidedWalkthrough" ? "active" : ""}`}
						onClick={() => onSelectView("guidedWalkthrough")}
					>
						<BookOpen size={15} />
						Walkthrough
					</button>
				)}
			</nav>

			<div className="filter-row">
				<div className="search-wrap">
					<Search size={14} className="search-icon" />
					<input
						className="search"
						aria-label="Search events"
						placeholder="Search events..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
					/>
				</div>
				<select
					className="filter"
					aria-label="Filter by actor"
					value={selectedActor}
					onChange={(e) => onSelectActor(e.target.value)}
				>
					<option value="all">All actors</option>
					{protocol.actors.map((a) => (
						<option key={a.id} value={a.id}>
							{a.label}
						</option>
					))}
				</select>
				<select
					className="filter"
					aria-label="Filter by phase"
					value={selectedPhase}
					onChange={(e) => onSelectPhase(e.target.value)}
				>
					<option value="all">All phases</option>
					{protocol.phases.map((p) => (
						<option key={p.id} value={p.id}>
							{p.label}
						</option>
					))}
				</select>
				{scenariosList.length > 0 && (
					<select
						className="filter scenario-select"
						aria-label="Select threat scenario"
						value={selectedScenarioId}
						onChange={(e) => onSelectScenario(e.target.value)}
					>
						{scenariosList.map((sc) => (
							<option key={sc.id} value={sc.id}>
								Scenario: {sc.name}
							</option>
						))}
					</select>
				)}
			</div>
		</div>
	);
}
