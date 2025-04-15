import GameBoard from "./GameBoard.js"
import gameConfig from "./gameConfig.js"

class GameManager {
	setup() {
		this.gameBoard = new GameBoard(gameConfig.gameBoard)
	}
}

export default GameManager