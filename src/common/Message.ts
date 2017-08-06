export interface Agent {
    name: string,
    role: string,
}

export interface Message<T> {
    meta: MetaData,
    data: Array<Measurement<T>>,
    timestamp: number,
}

export interface Rectangle {
    x: number, y: number, w: number, h: number
}

export interface Measurement<T> {
    name: string,
    value: T,
    unit: string
}

export interface MetaData {
    name: string,
}
