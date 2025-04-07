import { Container, Sprite, Text, Texture } from "pixi.js"
import { Layout } from "@pixi/layout"
import { Button } from "@pixi/ui"
import { navigation } from "../navigation.js"
import { animate } from "animejs"
import GameScore from "../ui/GameScore.js"

class GameScreen extends Layout {
	constructor() {
		super({
			styles: {
				opacity: 0
			}
		})

		this.gameScore = new GameScore()

		this.addContent({
			// game: {
			// 	match3: {

			// 	}
			// },
			score: {
				content: this.gameScore
			},
			// timer: {
			// 	content: // timer
			// },
		})
	}

	async show() {
		await animate(this, {
			alpha: 1,
			duration: 500,
			ease: 'linear'
		}).then()
	}
}

export default GameScreen