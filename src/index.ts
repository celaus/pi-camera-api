import * as http from 'http';
import * as debug from 'debug';
import { TomlReader } from '@sgarciac/bombadil';
import { SchedulerService } from './services/SchedulerService';
import { MQTTService } from './services/MQTTService';
import { CamService } from './services/CamService';
import { readFileSync } from 'fs';

import App from './App';

debug('ts-express:server');

const defaultImageWidth: number = 1920;
const defaultImageHeight: number = 1080;
const defaultTimeout: number = 0;

const args = process.argv.slice(2);
let configRaw = readFileSync(args[0]);

let reader = new TomlReader();
reader.readToml(configRaw.toString());
if (!reader.result) {
    console.log("Unable to read configuration: ", reader.errors);
    process.exit(1);
}
const config = reader.result;

const port = config['http']['port'] || 3000;
const topic = config['mqtt']['topic'] || 'topic';
const broker = config['mqtt']['broker'] || 'localhost:1883';
const user = config['mqtt']['user'] || 'user';
const password = config['mqtt']['password'] || 'password';
const useCert = 'ca' in config['mqtt'] && <boolean>config['mqtt']['ca'];
const caPath = config['mqtt']['ca'];

const interval = config['timelapse']['interval'] || 60000;
let resolution = [defaultImageWidth, defaultImageHeight];
if (config['timelapse']['resolution'] instanceof Array && config['timelapse']['resolution'].length === 2) {
    resolution = config['timelapse']['resolution'];
}
const imageWidth = resolution[0];
const imageHeight = resolution[1];

const timeout = config['camera']['timeout'] || defaultTimeout;

App.set('port', port);
const camService = new CamService(imageWidth, imageHeight, timeout);
const mqttService = new MQTTService(broker, user, password, useCert ? caPath : undefined);
const scheduler = new SchedulerService(() => {
    camService.takePhoto().then((photo) => {
        mqttService.publish(topic, photo);
    })
});

scheduler.start(interval);

const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
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