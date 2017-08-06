
export class SchedulerService {

    action: () => void;
    handle: NodeJS.Timer;

    constructor(action: () => void) {
        this.action = action;
        this.handle = undefined;
    }

    public start(ms: number) {
        this.handle = setInterval(this.action, ms);
    }

    public stop() {
        clearInterval(this.handle);
        this.handle = undefined;
    }
}
