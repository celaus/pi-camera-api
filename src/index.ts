import * as http from 'http';
import * as debug from 'debug';

import { SchedulerService } from './services/SchedulerService';
import { MQTTService } from './services/MQTTService';
import { CamService } from './services/CamService';
import { ConfigService } from './services/ConfigService';
import { Configuration } from './common/Config';
import { readFileSync } from 'fs';
import App from './App';

const log = console;

debug('ts-express:server');
let configFilePath = "config.toml";
if (process.argv.length == 3) {
    const args = process.argv.slice(2);
    configFilePath = args[0];
}
log.info("Reading config ", configFilePath);
let configRaw = readFileSync(configFilePath);

const configService = new ConfigService();
let configuration: Configuration = undefined;
try {
    configuration = configService.parse(configRaw.toString());
} catch (error) {
    log.error(`Could not read config: ${error}`);
    process.exit(1);
}

App.set('port', configuration.http.port);
log.info("Starting CamService");
const camService = new CamService(configuration.timelapse.width, configuration.timelapse.height, configuration.camera.timeout);
log.info("Starting MQTT Service");
const mqttService = new MQTTService(configuration.mqtt.broker, configuration.mqtt.port, configuration.mqtt.user, configuration.mqtt.password, configuration.mqtt.caPath);
log.info("Starting SchedulerService");
const scheduler = new SchedulerService(() => {
    camService.takePhoto().then((photo) => {
        const msg = JSON.stringify([{
            meta: configuration.agent,
            data: [{ "Binary": { name: "timelapse", unit: "image", value: Array.from(photo.values()) } }],
            timestamp: Date.now()
        }]);
        log.info("Sending message...");
        // blocking, this might be a bad idea if there's a lot of topics and/or slow internet connection
        configuration.mqtt.topic.forEach(t => mqttService.publish(t, msg));
    }).catch((reason) => {
        console.warn("Could not capture: ", reason);
    });
});
log.info("Starting Timelapse");
scheduler.start(configuration.timelapse.interval);

const server = http.createServer(App);
server.on('error', onError);
server.on('listening', onListening);
server.listen(configuration.http.port);
mqttService.shutdown();

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = 'Port ' + configuration.http.port;
    switch (error.code) {
        case 'EACCES':
            log.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            log.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}