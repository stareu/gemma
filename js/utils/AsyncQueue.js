class AsyncQueue {
    /** Queue of async functions that will be executed one after another */
    queue = [];
    /** Check if processing is paused */
    paused = false;
    /** Check if processing has been started and queue is not empty */
    processing = false;

    /** Pause the execution queue */
    pause() {
        this.paused = true;
    }

    /** Resume the execution queue */
    resume() {
        this.paused = false;
    }

    /** Check if the queue is processing */
    isProcessing() {
        return this.processing;
    }

    /** Check if the execution is paused */
    isPaused() {
        return this.processing;
    }

    /**
     * Add an async function to last in the queue, executing it right away
     * if the queue is empty and auto-start is set to true. If auto-start is set
     * to false, the execution queue should be started manually by calling `process()` method.
     * @param fn The function to be added.
     * @param autoStart Automatically start executing the queue.
     */
    async add(fn, autoStart = true) {
        this.queue.push(fn);
        if (autoStart) await this.process();
    }

    /** Run the execution queue one by one, awaiting each other. */
    async process() {
        if (this.processing) return;
        this.processing = true;
        while (this.queue.length) {
            if (this.paused) {
				// todo: refactor
                await _.sleep(100);
            } else {
                const fn = this.queue.shift();
                if (fn) await fn();
            }
        }
        this.processing = false;
    }

    /** Stop processing and remove all remaining functions in the queue. */
    clear() {
        this.queue.length = 0;
        this.processing = false;
        this.paused = false;
    }
}

export default AsyncQueue