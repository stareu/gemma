import { Container, Sprite, Text, Texture, Assets } from "pixi.js"
import { Layout } from "@pixi/layout"
import { Button } from "@pixi/ui"
import { navigation } from "../navigation.js"
import { animate } from "animejs"
import GameScore from "../ui/GameScore.js"
import Match3 from "../match3/Match3.js"
import dayjs from "dayjs"

class GameScreen extends Layout {
	/** @type { GameScore } */
	gameScore

	constructor() {
		super()

		// this.gameScore = new GameScore()
		this.match3 = new Match3()
	}

	async prepare() {
		await Assets.loadBundle([ 'game', 'common' ])

        this.match3.setup()

		this.timer = new Text({ text: '0' })

		this.addContent({
			match3: {
				content: this.match3,
				styles: {
					position: 'center',
					anchor: 0
				}
			},
			timer: {
				content: this.timer,
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

		this.match3._endTimer.on('tick', () => {
			this.timer.text = dayjs.duration(this.match3._endTimer.leftTime).format('HH:mm:ss')
		})
	}

    _onTimesUp() {
        this.pauseButton.hide()

        this.match3.stopPlaying()

        // Only finishes the game if match 3 is not auto-processing the grid
        if (!this.match3.process.isProcessing) {
			this.finish()
		}
    }
}

export default GameScreen