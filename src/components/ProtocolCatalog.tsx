import { useState } from "react";
import { BookOpen, CheckCircle, Compass, Layers, Search, Shield, Zap } from "lucide-react";
import type { ProtocolDefinition } from "../types";

type ProtocolCatalogProps = {
	protocols: ProtocolDefinition[];
	onSelectProtocol: (protocolId: string) => void;
	onSelectCompare: (protoAId: string) => void;
};

export function ProtocolCatalog({ protocols, onSelectProtocol, onSelectCompare }: ProtocolCatalogProps) {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const categories = [
		"all",
		"Transport",
		"Application",
		"Secure Transport",
		"End-to-End Encryption",
		"Identity & Authorization",
		"Messaging",
		"RPC",
		"Distributed Systems",
	];

	const filteredProtocols = protocols.filter((proto) => {
		if (selectedCategory !== "all" && proto.category !== selectedCategory) {
			return false;
		}
		if (selectedDifficulty !== "all" && proto.difficulty !== selectedDifficulty) {
			return false;
		}
		if (searchQuery.trim() !== "") {
			const q = searchQuery.toLowerCase();
			const matchName = proto.name.toLowerCase().includes(q);
			const matchDesc = proto.description.toLowerCase().includes(q);
			const matchTags = (proto.tags || []).some((t) => t.toLowerCase().includes(q));
			if (!matchName && !matchDesc && !matchTags) {
				return false;
			}
		}
		return true;
	});

	return (
		<section className="catalog-section" aria-labelledby="catalog-title">
			<div className="catalog-header-band">
				<div>
					<p className="eyebrow">Interactive Protocol Learning Catalog</p>
					<h2 id="catalog-title">Explore Communication Protocols</h2>
					<p>
						Select a protocol to inspect message flows, cryptographic operations, state transitions, and failure scenarios.
					</p>
				</div>
			</div>

			<div className="catalog-filter-bar">
				<div className="search-wrap catalog-search">
					<Search size={16} className="search-icon" />
					<input
						className="search"
						aria-label="Search protocol catalog"
						placeholder="Search by name, tag, or technology (e.g. UDP, TLS, OAuth)..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<div className="category-pills" aria-label="Category filters">
					{categories.map((cat) => (
						<button
							key={cat}
							className={`cat-pill ${selectedCategory === cat ? "active" : ""}`}
							onClick={() => setSelectedCategory(cat)}
						>
							{cat === "all" ? "All Categories" : cat}
						</button>
					))}
				</div>

				<select
					className="filter"
					aria-label="Filter by difficulty"
					value={selectedDifficulty}
					onChange={(e) => setSelectedDifficulty(e.target.value)}
				>
					<option value="all">All Difficulties</option>
					<option value="Beginner">Beginner</option>
					<option value="Intermediate">Intermediate</option>
					<option value="Advanced">Advanced</option>
				</select>
			</div>

			<div className="catalog-grid">
				{filteredProtocols.map((proto) => (
					<article key={proto.id} className="catalog-card">
						<div className="catalog-card-header">
							<span className="cat-badge">{proto.category}</span>
							<span className={`diff-badge ${proto.difficulty?.toLowerCase() || "beginner"}`}>
								{proto.difficulty || "Beginner"}
							</span>
						</div>

						<h3>{proto.name}</h3>
						<p className="proto-desc">{proto.description}</p>

						{proto.learningObjectives && proto.learningObjectives.length > 0 && (
							<div className="objectives-list">
								<strong>Learning Objectives:</strong>
								<ul>
									{proto.learningObjectives.map((obj, idx) => (
										<li key={idx}>
											<CheckCircle size={13} style={{ marginRight: 6, flexShrink: 0 }} />
											<span>{obj}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{proto.tags && proto.tags.length > 0 && (
							<div className="tag-pills">
								{proto.tags.map((t) => (
									<span key={t} className="tag-pill">
										#{t}
									</span>
								))}
							</div>
						)}

						<div className="catalog-card-footer">
							<button className="button primary" onClick={() => onSelectProtocol(proto.id)}>
								<Zap size={14} style={{ marginRight: 6 }} /> Explore Protocol
							</button>
							<button className="button" onClick={() => onSelectCompare(proto.id)}>
								<Compass size={14} style={{ marginRight: 6 }} /> Compare
							</button>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
