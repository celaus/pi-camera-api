import * as http from 'http';
import * as debug from 'debug';
import { SchedulerService } from './services/SchedulerService';
import { MQTTService } from './services/MQTTService';
import { CamService } from './services/CamService';
import { ConfigService } from './services/ConfigService';
import { Configuration } from './common/Config';
import { readFileSync } from 'fs';
import App from './App';


debug('ts-express:server');
let configFilePath = "config.toml";
if (process.argv.length == 3) {
    const args = process.argv.slice(2);
    configFilePath = args[0];
}
let configRaw = readFileSync(configFilePath);

const configService = new ConfigService();
let configuration: Configuration = undefined;
try {
    configuration = configService.parse(configRaw.toString());
} catch (error) {
    console.log(`Could not read config: ${error}`);
    process.exit(1);
}

App.set('port', configuration.http.port);

const camService = new CamService(configuration.timelapse.width, configuration.timelapse.height, configuration.camera.timeout);
const mqttService = new MQTTService(configuration.mqtt.broker, configuration.mqtt.user, configuration.mqtt.password, configuration.mqtt.caPath);

const scheduler = new SchedulerService(() => {
    camService.takePhoto().then((photo) => {
        const message = {
            meta: configuration.agent,
            data: [{ name: "timelapse", unit: "image", value: photo }],
            timestamp: Date.now()
        };
        const msg = JSON.stringify(message);
        // blocking, this might be a bad idea if there's a lot of topics and/or slow internet connection
        configuration.mqtt.topic.forEach(t => mqttService.publish(t, msg));
    })
});

scheduler.start(configuration.timelapse.interval);

const server = http.createServer(App);
server.listen(configuration.http.port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = 'Port ' + configuration.http.port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
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