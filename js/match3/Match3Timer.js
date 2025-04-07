import EventEmitter from "eventemitter3"

class Match3Timer extends EventEmitter {
	time = 0
	duration = 0
	isPaused = false
	isRunning = false

	reset() {
		this.time = 0
		this.duration = 0
		this.isPaused = false
		this.isRunning = false
	}

	setup(duration) {
		this.reset()
		this.duration = duration
	}

	start() {
		this.isPaused = false
		this.isRunning = true
		this.time = 0
	}

	stop() {
		this.isPaused = false
		this.isRunning = false
		this.time = 0
	}

	pause() {
		this.isPaused = true
	}

	resume() {
		this.isPaused = false
	}

	update(delta) {
		if (!this.isPaused && this.isRunning) {
			this.time += delta

			if (this.time >= this.duration) {
				this.stop()
				
				this.emit('expired')
			}
		}
	}

	getTimeRemaining() {
		return this.duration - this.time
	}
}

export default Match3Timer