import { Timer } from "./Timer";

export class Player {
    constructor(onTick, tickPerSecond, sampleLength) {
        this.tickPerSecond = tickPerSecond;
        this.numberOfTicks = 0;
        this.sampleLength = sampleLength;
        this.onTick = onTick;
        this.gameLoop = new Timer(() => { this.tick() }, this.tickPerSecond);
        this.gameLoop.start();
    }

    start() {
        if (!this.gameLoop) {
            this.gameLoop = new Timer(() => { this.tick() }, this.tickPerSecond);
        } else {
            this.gameLoop.start();
        }
    }

    pause() {
        if (this.gameLoop) {
            this.gameLoop.pause();
        }
    }

    tick() {
        if (this.numberOfTicks <= this.sampleLength) {
            this.numberOfTicks += 1; 
            this.onTick(this.numberOfTicks);
        }
    }

    destroy() {
        // tear down the timer
        this.gameLoop?.stop();
    }
};
