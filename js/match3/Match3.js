import { Container, Sprite, Text, Texture } from "pixi.js"
import { match3GetConfig } from "./Match3Config"
import Match3Timer from "./Match3Timer.js"
import Match3Stats from "./Match3Stats.js"
import Match3Board from "./Match3Board.js"

class Match3 extends Container {
	constructor() {
		super()

		this.config = match3GetConfig()
		this.timer = new Match3Timer()
		this.stats = new Match3Stats()
		this.board = new Match3Board(this)
	}

	setup() {
		// mb todo: конфиг переопределяется в GameScreen (берётся из настроек юзера), пока оставляем дефолт
		this.board.setup(this.config)
	}

	getGameplayPerformance() {
		return this.stats.getGameplayPerformance(this.timer.time)
    }

	isPlaying() {
		return this.interactiveChildren
	}
}

export default Match3