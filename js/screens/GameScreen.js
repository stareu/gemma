import { Container, Sprite, Text, Texture, Assets } from "pixi.js"
import { Layout } from "@pixi/layout"
import GameManager from "../match3/GameManager.js"

class GameScreen extends Layout {
	/** @type { GameScore } */
	gameScore

	constructor() {
		super()
	}

	async prepare() {
		await Assets.loadBundle('game')

		this.gameManager = new GameManager()

		this.gameManager.setup()

        // this.match3.setup()

		// this.timer = new Text({ text: '0' })

		this.addContent({
			match3: {
				content: this.gameManager.gameBoard,
				styles: {
					position: 'center',
				}
			},
			// timer: {
			// 	content: this.timer,
			// }
		})
	}

	async show() {
		// await animate(this, {
		// 	alpha: 1,
		// 	duration: 500,
		// 	ease: 'linear'
		// }).then()
	}
}

export default GameScreen