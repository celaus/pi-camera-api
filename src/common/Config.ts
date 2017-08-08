export interface Configuration {
    http: HTTP,
    mqtt: MQTT,
    camera: Camera,
    timelapse: Timelapse,
    agent: Device
}

export interface HTTP {
    port: number
}

export interface MQTT {
    topic: Array<string>,
    broker: string,
    port: number,
    user?: string,
    password?: string,
    caPath?: string
}

export interface Camera {
    timeout: number
}

export interface Timelapse {
    width: number,
    height: number,
    interval: number,
}


export interface Device {
    name: string,
    role: string
}