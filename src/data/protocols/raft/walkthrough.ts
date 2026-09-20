import type { Walkthrough } from "../../../types";

export const raftWalkthrough: Walkthrough = {
	protocolId: "raft",
	title: "Guided Walkthrough: Raft Leader Election & Log Replication",
	description: "Learn how Raft nodes achieve consensus and elect cluster leaders.",
	steps: [
		{
			id: "r_w1",
			title: "1. Follower Timeout & Election",
			t: 0,
			highlightActors: ["NodeA", "NodeB", "NodeC"],
			narrative: "Node A's election timer expires. It becomes a Candidate for Term 2 and broadcasts RequestVote RPCs.",
			whyItMatters: "Randomized election timeouts prevent split votes and guarantee prompt leader election.",
		},
		{
			id: "r_w2",
			title: "2. Quorum Vote & Leader Heartbeat",
			t: 3,
			highlightActors: ["NodeA", "NodeB"],
			narrative: "Node A receives majority votes (Node B and Node C). It becomes Leader and broadcasts AppendEntries heartbeats.",
			whyItMatters: "Heartbeats suppress follower election timers and maintain leader authority across Term 2.",
		},
	],
};
