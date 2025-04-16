import GameBoard from "./GameBoard.js"
import BoardTouchHandler from "./BoardTouchHandler.js"
import gameConfig from "./gameConfig.js"
import { animate } from "animejs"

class GameManager {
	setup() {
		this.gameBoard = new GameBoard(gameConfig.gameBoard)
		this.boardTouch = new BoardTouchHandler(this.gameBoard)

		this.boardTouch.on('swap', async (el1, el2) => {
			this.gameBoard.swapElements(el1, el2)

			// Чтобы элемент всегда был выше второго
			this.gameBoard.addChild(el1)

			animate(el1.position, {
				x: el2.position.x,
				y: el2.position.y,
				duration: 200
			})

			await animate(el2.position, {
				x: el1.position.x,
				y: el1.position.y,
				duration: 200
			}).then()
		})
	}
}

export default GameManager