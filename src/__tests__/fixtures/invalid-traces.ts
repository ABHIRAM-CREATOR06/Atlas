export const invalidActorTrace = JSON.stringify({
	id: "inv_1",
	t: 0,
	actor: "MalloryTheHacker",
	event: "FetchPrekeyBundle",
});

export const unproducedRefTrace = JSON.stringify({
	id: "inv_2",
	t: 0,
	actor: "Alice",
	event: "KDF",
	inputs: ["non_existent_secret_ref_99"],
});

export const duplicateEventIdTrace = [
	JSON.stringify({ id: "dup_1", t: 0, actor: "Alice", event: "FetchPrekeyBundle" }),
	JSON.stringify({ id: "dup_1", t: 1, actor: "Alice", event: "FetchPrekeyBundle" }),
].join("\n");
