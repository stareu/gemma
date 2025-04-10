import { Container } from "pixi.js"
import { match3GetConfig } from "./Match3Config"
import Match3Timer from "./Match3Timer.js"
import Match3Stats from "./Match3Stats.js"
import Match3Board from "./Match3Board.js"
import Match3Actions from "./Match3Actions.js"
import Match3Process from "./Match3Process.js"
import Match3Special from "./Match3Special.js"
import Timer from "../utils/Timer.js"

class Match3 extends Container {
	constructor() {
		super()

		this.config = match3GetConfig()
		this.stats = new Match3Stats()
		this.board = new Match3Board(this)
		this.actions = new Match3Actions(this)
		this.process = new Match3Process(this)
		this.special = new Match3Special(this)
	}

	setup() {
		// mb todo: конфиг переопределяется в GameScreen (берётся из настроек юзера), пока оставляем дефолт
		const config = this.config

        this.reset()

        this.actions.setup(config)
        this.board.setup(config)
	}

	getGameplayPerformance() {
		return this.stats.getGameplayPerformance(this._endTimer.elapsedTime)
    }

	isPlaying() {
		return this.interactiveChildren
	}

	// todo: убрать reset? пока неясно зачем он
	reset() {
		this.interactiveChildren = false

        this.stats.reset()
        this.board.reset()
        this.special.reset()
        this.process.reset()
	}

    startPlaying() {
        this.interactiveChildren = true

		this._endTimer = new Timer(Date.now() + this.config.duration * 1e3)
		this._endTimer.once('end', this.stopPlaying.bind(this))
    }

    stopPlaying() {
        this.interactiveChildren = false
    }

	pause() {
        // this.timer.pause()
        this.board.pause()
        this.process.pause()
    }

    /** Resume the game */
    resume() {
        // this.timer.resume()
        this.board.resume()
        this.process.resume()
    }
}

export default Match3