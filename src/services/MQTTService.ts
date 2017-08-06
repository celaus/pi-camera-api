
import { connect, MqttClient } from "mqtt";

/**
 * A service to publish data to an MQTT queue.
 */
export class MQTTService {

    client: MqttClient;

    constructor(broker_address: string, username: string, password: string, ca: string) {
        this.client = connect(broker_address, { username: username, password: password, ca: ca, protocol: "mqtt" });
    }

    publish(topic: string, message: string | Buffer) {
        this.client.publish(topic, message);
    }
}