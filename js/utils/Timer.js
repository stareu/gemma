import EventEmitter from "eventemitter3"

class Timer extends EventEmitter {
	_startTime
	_endTime
	_interval

	constructor(endTime) {
		super()

		this._startTime = Date.now()

		if (endTime) {
			this._endTime = endTime
			this._interval = setInterval(this._update.bind(this), 1e3)
		}
		else {
			this._interval = setInterval(this.emit.bind(this, 'tick'), 1e3)
		}
	}

	_update() {
		this.emit('tick')

		if (Date.now() >= this._endTime) {
			this.emit('end')

			this.stop()
		}
	}

	stop() {
		clearInterval(this._interval)

		super.removeAllListeners()
	}

	get elapsedTime() {
		return Date.now() - this._startTime
	}

	get leftTime() {
		return this._endTime - Date.now()
	}
}

export default Timer