export class Timer {  
    constructor(onStep, tickPerSecond) {
        this.tickPerSecond = tickPerSecond;
        this.onStep = onStep;
        this.rafCallback = null;
    };

    start() {
        let previousMs;
        const step = 1 / this.tickPerSecond;
        const tick = (timestampMs) => {
            if (previousMs === undefined) {
                previousMs = timestampMs;
            }
            let delta = (timestampMs - previousMs) / 1000;
            while (delta >= step) {
                this.onStep();
                delta -= step;
            }
            previousMs = timestampMs - delta * 1000;
            this.rafCallback = requestAnimationFrame(tick);
        };

        this.rafCallback = requestAnimationFrame(tick);
    };

    pause() {
        if (this.rafCallback) {
            cancelAnimationFrame(this.rafCallback);
            this.rafCallback = null;
        }
    }

    resume() {
        if (!this.rafCallback) {
            this.start();
        }
    }

    stop() {
        this.pause();
    }
}