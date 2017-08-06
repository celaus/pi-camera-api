import { Configuration } from '../common/Config';
import { TomlReader } from '@sgarciac/bombadil';


export class ConfigService {

    private defaultImageWidth: number = 1920;
    private defaultImageHeight: number = 1080;
    private defaultTimeout: number = 10; // milliseconds
    private defaultInterval: number = 60000; // milliseconds
    private defaultPort: number = 3000;
    private defaultTopics = ["topic"];
    private defaultBrokerAddress = 'localhost:1883'
    private defaultRole = 'role'
    private defaultName = 'agent'

    private get_resolution(config: any): Array<number> {
        let resolution = [this.defaultImageWidth, this.defaultImageHeight];
        if (config['timelapse']['resolution'] instanceof Array && config['timelapse']['resolution'].length === 2) {
            resolution = config['timelapse']['resolution'];
        }
        return resolution;
    }

    /**
     * Parses a string configuration into an `Configuration` interface.
     * @param rawConfig TOML configuration to read from.
     */
    public parse(toml: string): Configuration {
        let reader = new TomlReader();
        reader.readToml(toml.toString());
        if (!reader.result) {
            throw new Error(`Unable to read configuration: ${reader.errors ? reader.errors : "Invalid TOML found"}`);
        }
        const config = reader.result;
        const resolution = this.get_resolution(config);
        const imageWidth = resolution[0];
        const imageHeight = resolution[1];
        return {
            http: {
                port: config['http']['port'] || this.defaultPort,
            },
            mqtt: {
                topic: config['mqtt']['topic'] || this.defaultTopics,
                broker: config['mqtt']['broker'] || this.defaultBrokerAddress,
                user: config['mqtt']['user'] || undefined,
                password: config['mqtt']['password'] || undefined,
                caPath: 'ca' in config['mqtt'] ? config['mqtt']['ca'] : undefined,
            },
            timelapse: {
                width: imageWidth,
                height: imageHeight,
                interval: config['timelapse']['interval'] || this.defaultInterval
            },
            camera: {
                timeout: config['camera']['timeout'] || this.defaultTimeout
            },
            agent: {
                name: config['device']['name'] || this.defaultName,
                role: config['device']['name'] || this.defaultRole,
            }
        };
    }
}