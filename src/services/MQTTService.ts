
import { connect, MqttClient } from "mqtt";

/**
 * A service to publish data to an MQTT queue.
 */
export class MQTTService {

    client: MqttClient;

    constructor(broker_address: string, port: number, username: string, password: string, ca: string) {
        this.client = connect(undefined, { host: broker_address, port: port, username: username, password: password, ca: ca, protocol: "mqtt" });
    }

    publish<T>(topic: string, message: string | Buffer) {
        this.client.publish(topic, message);
    }
    /**
     * shutdown
     */
    public shutdown() {
        this.client.end();
    }
}
