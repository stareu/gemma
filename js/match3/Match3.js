import { Container, Sprite } from "pixi.js"
import { match3GetConfig } from "./Match3Config"
import Match3Timer from "./Match3Timer.js"
import Match3Stats from "./Match3Stats.js"
import Match3Board from "./Match3Board.js"
import Match3Actions from "./Match3Actions.js"
import Match3Process from "./Match3Process.js"
import Match3Special from "./Match3Special.js"

class Match3 extends Container {
	constructor() {
		super()

		this.config = match3GetConfig()
		this.timer = new Match3Timer()
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
        this.timer.setup(config.duration * 1000)
	}

	getGameplayPerformance() {
		return this.stats.getGameplayPerformance(this.timer.time)
    }

	isPlaying() {
		return this.interactiveChildren
	}

	reset() {
		this.interactiveChildren = false

        this.timer.reset()
        this.stats.reset()
        this.board.reset()
        this.special.reset()
        this.process.reset()
	}

    startPlaying() {
        this.interactiveChildren = true
        this.timer.start()
    }

    stopPlaying() {
        this.interactiveChildren = false
        this.timer.stop()
    }

	pause() {
        this.timer.pause()
        this.board.pause()
        this.process.pause()
    }

    /** Resume the game */
    resume() {
        this.timer.resume()
        this.board.resume()
        this.process.resume()
    }
}

export default Match3