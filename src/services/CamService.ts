import { Raspistill } from "node-raspistill";

export class CamService {
    cameraInstance: Raspistill;

    constructor(w: number, h: number, timeout: number) {
        this.cameraInstance = new Raspistill({
            width: w,
            height: h,
            time: timeout,
            encoding: 'png',
            noFileSave: true
        });
    }

    takePhoto(): Promise<Buffer> {
        return this.cameraInstance.takePhoto();
    }
}
