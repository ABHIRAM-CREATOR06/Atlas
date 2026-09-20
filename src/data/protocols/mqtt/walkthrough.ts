import type { Walkthrough } from "../../../types";

export const mqttWalkthrough: Walkthrough = {
	protocolId: "mqtt",
	title: "Guided Walkthrough: MQTT Pub/Sub & QoS 1 Routing",
	description: "Learn how brokers route messages and handle delivery acknowledgements.",
	steps: [
		{
			id: "mqtt_w1",
			title: "1. Topic Subscription",
			t: 2,
			highlightActors: ["Subscriber", "Broker"],
			narrative: "Subscriber connects to broker and subscribes to topic filter 'sensors/temp' with QoS 1.",
			whyItMatters: "Decouples publisher from subscriber; publisher does not need to know who receives data.",
		},
		{
			id: "mqtt_w2",
			title: "2. Publish & Broker Routing",
			t: 5,
			highlightActors: ["Publisher", "Broker", "Subscriber"],
			narrative: "Sensor publisher transmits temperature reading to broker. Broker routes payload to all matching subscribers.",
			whyItMatters: "Enables one-to-many broadcast routing over lightweight transport.",
		},
	],
};
