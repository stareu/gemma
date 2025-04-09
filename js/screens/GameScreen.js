import { Container, Sprite, Text, Texture, Assets } from "pixi.js"
import { Layout } from "@pixi/layout"
import { Button } from "@pixi/ui"
import { navigation } from "../navigation.js"
import { animate } from "animejs"
import GameScore from "../ui/GameScore.js"
import Match3 from "../match3/Match3.js"

class GameScreen extends Layout {
	isFinished = false

	/** @type { GameScore } */
	gameScore

	constructor() {
		super()

		// this.gameScore = new GameScore()
		this.match3 = new Match3()
	}

	async prepare() {
		await Assets.loadBundle([ 'game', 'common' ])

		this.isFinished = false

        this.match3.setup()

		this.addContent({
			content: this.match3,
			styles: {
				position: 'center',
				anchor: 0
			}
		})
	}

	async show() {
		// await animate(this, {
		// 	alpha: 1,
		// 	duration: 500,
		// 	ease: 'linear'
		// }).then()

		this.match3.startPlaying()
	}

    _onTimesUp() {
        this.pauseButton.hide()

        this.match3.stopPlaying()

        // Only finishes the game if match 3 is not auto-processing the grid
        if (!this.match3.process.isProcessing) {
			this.finish()
		}
    }

    async finish() {
        if (!this.isFinished) {
			this.isFinished = true

			this.match3.stopPlaying()

			// const performance = this.match3.stats.getGameplayPerformance()

			// userStats.save(this.match3.config.mode, performance)

			// navigation.showScreen(ResultScreen)
		}
    }
}

export default GameScreen