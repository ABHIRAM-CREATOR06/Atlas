import type { ProtocolDefinition } from "../../../types";

export const raftDefinition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "raft",
	name: "Raft Consensus Protocol",
	version: "1.0.0",
	category: "Distributed Systems",
	difficulty: "Advanced",
	tags: ["Consensus", "Leader Election", "Log Replication", "Distributed Systems"],
	description:
		"Trace distributed consensus, leader election timeouts, RequestVote RPCs, AppendEntries heartbeats, and log commitment across cluster nodes.",
	documentationUrl: "https://raft.github.io/raft.pdf",
	learningObjectives: [
		"Understand Node FSM states (Follower -> Candidate -> Leader)",
		"Observe RequestVote RPCs and majority quorum voting in Term T",
		"Trace AppendEntries log replication and Commit Index advancement",
	],
	actors: [
		{ id: "NodeA", label: "Node A (Candidate)", color: "#2878c8", description: "Cluster node initiating election" },
		{ id: "NodeB", label: "Node B (Follower)", color: "#8152b8", description: "Cluster node B" },
		{ id: "NodeC", label: "Node C (Follower)", color: "#188477", description: "Cluster node C" },
	],
	phases: [
		{ id: "election", label: "Leader Election", description: "Follower timeout triggers candidate election for Term T" },
		{ id: "heartbeat", label: "Heartbeat & Authority", description: "Elected Leader sends AppendEntries heartbeats to maintain authority" },
		{ id: "replication", label: "Log Replication", description: "Leader replicates state machine log entries to quorum" },
	],
	messages: {
		RequestVote: {
			label: "RequestVote [Term: 2, Candidate: NodeA]",
			color: "#2878c8",
			phase: "election",
			fields: [
				{ key: "term", label: "Term", kind: "number" },
				{ key: "candidate_id", label: "Candidate ID", kind: "text" },
			],
		},
		VoteGranted: {
			label: "VoteGranted [Term: 2, Vote: Yes]",
			color: "#8152b8",
			phase: "election",
			fields: [
				{ key: "term", label: "Term", kind: "number" },
				{ key: "granted", label: "Vote Granted", kind: "text" },
			],
		},
		AppendEntriesHeartbeat: {
			label: "AppendEntries Heartbeat [Term: 2, Leader: NodeA]",
			color: "#188477",
			phase: "heartbeat",
			fields: [
				{ key: "term", label: "Term", kind: "number" },
				{ key: "leader_id", label: "Leader ID", kind: "text" },
			],
		},
		AppendEntriesLog: {
			label: "AppendEntries [Log: SET x=10, Term: 2]",
			color: "#b66a16",
			phase: "replication",
			fields: [
				{ key: "term", label: "Term", kind: "number" },
				{ key: "log_index", label: "Log Index", kind: "number" },
				{ key: "command", label: "Command", kind: "text" },
			],
		},
		LogAck: {
			label: "AppendEntries Response [Success: true]",
			color: "#8152b8",
			phase: "replication",
			fields: [
				{ key: "match_index", label: "Match Index", kind: "number" },
			],
		},
	},
	operationTypes: {},
	stepTypes: {
		StateChange: {
			label: "Role Transition",
			color: "#8152b8",
			fields: [{ key: "role", label: "Raft Role", kind: "text" }],
		},
	},
	stateVariables: [
		{ id: "current_term", label: "Current Term", owner: "NodeA", type: "uint64", description: "Monotonically increasing Raft term number" },
		{ id: "commit_index", label: "Commit Index", owner: "NodeA", type: "uint64", description: "Highest log entry known to be committed" },
	],
	transitions: [
		{ from: "FOLLOWER", to: "CANDIDATE", event: "RequestVote", label: "Election Timeout" },
		{ from: "CANDIDATE", to: "LEADER", event: "VoteGranted", label: "Quorum Achieved" },
		{ from: "LEADER", to: "FOLLOWER", event: "AppendEntriesHeartbeat", label: "Higher Term Discovered" },
	],
	invariants: [
		{ id: "raft_inv", name: "Election Safety", description: "At most one leader can be elected per term." },
	],
	securityProperties: [
		{ id: "raft_sec", name: "Leader Completeness", description: "If a log entry is committed in a term, it is present in leaders of higher terms." },
	],
	failureModes: [
		{ id: "raft_split_vote", name: "Split Vote", description: "Multiple candidates split votes in a term; election times out and restarts." },
	],
	glossary: [
		{ term: "Term", definition: "Logical time unit in Raft divided into election and normal operation." },
		{ term: "Commit Index", definition: "Log index replicated to a majority quorum of nodes." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
