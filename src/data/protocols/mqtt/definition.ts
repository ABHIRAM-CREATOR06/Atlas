import type { ProtocolDefinition } from "../../../types";

export const mqttDefinition: ProtocolDefinition = {
	schemaVersion: "1.0.0",
	id: "mqtt",
	name: "MQTT Protocol",
	version: "5.0.0",
	category: "Messaging",
	difficulty: "Intermediate",
	tags: ["Publish/Subscribe", "Broker Routing", "IoT", "QoS Levels"],
	description:
		"Trace lightweight broker-mediated publish/subscribe messaging across IoT clients and topics.",
	documentationUrl: "https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html",
	learningObjectives: [
		"Understand Client-to-Broker publish/subscribe model",
		"Observe Quality of Service (QoS 0, QoS 1, QoS 2) delivery guarantees",
		"Trace retained messages and Last Will and Testament (LWT) triggers",
	],
	actors: [
		{ id: "Publisher", label: "Sensor Publisher", color: "#2878c8", description: "IoT client publishing telemetry" },
		{ id: "Broker", label: "MQTT Broker", color: "#8152b8", description: "Central message routing broker" },
		{ id: "Subscriber", label: "App Subscriber", color: "#188477", description: "Application subscribing to topic" },
	],
	phases: [
		{ id: "connect", label: "Connect", description: "Establish MQTT session with broker" },
		{ id: "subscribe", label: "Subscribe", description: "Subscribe to topic filter e.g. sensors/temp" },
		{ id: "publish", label: "Publish & Routing", description: "Broker routes published payload to subscribers" },
	],
	messages: {
		Connect: {
			label: "CONNECT [ClientID: sensor_01]",
			color: "#2878c8",
			phase: "connect",
			fields: [
				{ key: "client_id", label: "Client ID", kind: "text" },
				{ key: "keep_alive", label: "Keep Alive (sec)", kind: "number" },
			],
		},
		ConnAck: {
			label: "CONNACK [Success]",
			color: "#8152b8",
			phase: "connect",
			fields: [{ key: "return_code", label: "Return Code", kind: "number" }],
		},
		Subscribe: {
			label: "SUBSCRIBE [topic: sensors/temp, QoS 1]",
			color: "#188477",
			phase: "subscribe",
			fields: [
				{ key: "topic", label: "Topic Filter", kind: "text" },
				{ key: "qos", label: "QoS Level", kind: "number" },
			],
		},
		SubAck: {
			label: "SUBACK [QoS 1 Granted]",
			color: "#8152b8",
			phase: "subscribe",
			fields: [{ key: "qos_granted", label: "Granted QoS", kind: "number" }],
		},
		Publish: {
			label: "PUBLISH [topic: sensors/temp, payload: 24.5°C]",
			color: "#2878c8",
			phase: "publish",
			fields: [
				{ key: "topic", label: "Topic", kind: "text" },
				{ key: "qos", label: "QoS", kind: "number" },
				{ key: "payload", label: "Payload", kind: "text" },
			],
		},
		PubForward: {
			label: "Broker Forward ➔ Subscriber",
			color: "#188477",
			phase: "publish",
			fields: [
				{ key: "topic", label: "Topic", kind: "text" },
				{ key: "payload", label: "Payload", kind: "text" },
			],
		},
		PubAck: {
			label: "PUBACK [PacketID: 42]",
			color: "#8152b8",
			phase: "publish",
			fields: [{ key: "packet_id", label: "Packet ID", kind: "number" }],
		},
	},
	operationTypes: {},
	stepTypes: {},
	stateVariables: [
		{ id: "session_state", label: "Broker Subscriptions", owner: "Broker", type: "Set", description: "Active subscriptions per topic" },
	],
	transitions: [
		{ from: "DISCONNECTED", to: "CONNECTED", event: "ConnAck", label: "Connected" },
		{ from: "CONNECTED", to: "SUBSCRIBED", event: "SubAck", label: "Topic Subscribed" },
	],
	invariants: [],
	securityProperties: [
		{ id: "mqtt_sec", name: "Topic ACL", description: "Broker validates topic publishing permissions per client." },
	],
	failureModes: [
		{ id: "mqtt_unauth", name: "Unauthorized Topic", description: "Client attempts to publish to prohibited topic filter." },
	],
	glossary: [
		{ term: "Broker", definition: "Central server managing MQTT subscriptions and routing." },
		{ term: "QoS 1", definition: "At least once delivery guarantee with PUBACK acknowledgement." },
	],
	views: ["sequenceDiagram", "stateTimeline", "stateMachine", "guidedWalkthrough"],
};
