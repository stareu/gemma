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
}

export default GameScreen