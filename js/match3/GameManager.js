import GameBoard from "./GameBoard.js"
import BoardTouchHandler from "./BoardTouchHandler.js"
import AnimationManager from "./AnimationManager.js"
import gameConfig from "./gameConfig.js"
import BoardProcessor from "./BoardProcessor.js"

class GameManager {
	/** @type { GameBoard } */
	gameBoard
	/** @type { BoardTouchHandler } */
	boardTouch
	/** @type { AnimationManager } */
	animation
	/** @type { BoardProcessor } */
	boardProcessor

	setup() {
		this.gameBoard = new GameBoard(gameConfig.gameBoard)

		this.animation = new AnimationManager()

		this.boardProcessor = new BoardProcessor(this.gameBoard, this.animation)

		this.boardTouch = new BoardTouchHandler(this.gameBoard)
		this.boardTouch.on('swap', this._onSwapElements.bind(this))

		window.gameManager = this
	}

	async _onSwapElements(el1, el2) {
		const gameBoard = this.gameBoard

		this.boardTouch.disable()

		gameBoard.swapElements(el1, el2)

		const matches = gameBoard.findMatches()

		// Чтобы элемент всегда был выше второго
		gameBoard.addChild(el1)
		
		if (matches.length) {
			await this.animation.animateSwapElements(el1, el2)

			await this.boardProcessor.process()
		}
		else {
			gameBoard.swapElements(el2, el1)

			await this.animation.animateSwapElements(el1, el2)
			await this.animation.animateSwapElements(el2, el1)
		}

		this.boardTouch.enable()
	}
}

export default GameManager