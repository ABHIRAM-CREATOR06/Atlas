export const validX3DHTrace = [
	JSON.stringify({ id: "e1", t: 0, actor: "Bob", event: "PublishPrekeys", phase: "setup", output_ref: "b1" }),
	JSON.stringify({ id: "e2", t: 2, actor: "Alice", event: "FetchPrekeyBundle", phase: "key_agreement", inputs: ["b1"] }),
].join("\n");

export const validTCPTrace = [
	JSON.stringify({ id: "t1", t: 0, actor: "Client", event: "SYN", phase: "handshake", seq: 100 }),
	JSON.stringify({ id: "t2", t: 1, actor: "Server", event: "SYN_ACK", phase: "handshake", seq: 500, ack: 101 }),
	JSON.stringify({ id: "t3", t: 2, actor: "Client", event: "ACK", phase: "handshake", ack: 501 }),
].join("\n");
