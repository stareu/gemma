import { Container, Sprite, Text, Texture, Assets } from "pixi.js"
import { Layout } from "@pixi/layout"
import GameBoard from "../match3/GameBoard.js"
import gameConfig from "../match3/gameConfig.js"

class GameScreen extends Layout {
	/** @type { GameScore } */
	gameScore

	constructor() {
		super()
	}

	async prepare() {
		await Assets.loadBundle('game')

		this.gameBoard = new GameBoard(gameConfig.gameBoard)

		this.addChild(this.gameBoard)

        // this.match3.setup()

		// this.timer = new Text({ text: '0' })

		// this.addContent({
		// 	match3: {
		// 		content: this.match3,
		// 		styles: {
		// 			position: 'center',
		// 		}
		// 	},
		// 	timer: {
		// 		content: this.timer,
		// 	}
		// })
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