import { Container, Sprite, Text, Texture } from "pixi.js"
import { match3GetConfig } from "./Match3Config"
import Match3Timer from "./Match3Timer.js"
import Match3Stats from "./Match3Stats.js"

class Match3 extends Container {
	constructor() {
		super()

		this.config = match3GetConfig()
		this.timer = new Match3Timer()
		this.stats = new Match3Stats()
	}

	getGameplayPerformance() {
        const grade = this.stats.caulculateGrade(this.timer.time)

        return { ...this.data, grade }
    }
}

export default Match3