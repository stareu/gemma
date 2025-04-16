import EventEmitter from "eventemitter3"
import GameBoard from "./GameBoard.js"

const MAX_DISTANCE = 10

class BoardTouchHandler extends EventEmitter {
	/** @type { GameBoard } */
	gameBoard
	startPos
	startElement

	constructor(gameBoard) {
		super()

		this.gameBoard = gameBoard

		gameBoard.on('mousedown', this._onMouseDown.bind(this))
		gameBoard.on('mouseup', this._onMouseUp.bind(this))
		gameBoard.on('mousemove', this._onMouseMove.bind(this))
	}

	_onMouseMove(e) {
		if (this.startPos) {
			const xDiff = e.global.x - this.startPos.x
			const yDiff = e.global.y - this.startPos.y
			const distanceX = Math.abs(xDiff)
			const distanceY = Math.abs(yDiff)
			const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

			let starRow = this.startElement.row
			let starCol = this.startElement.column

			if (distance > MAX_DISTANCE) {
				if (distanceX > distanceY) {
					if (xDiff > 0) {
						starCol ++
					}
					else {
						starCol --
					}
				}
				else {
					if (yDiff > 0) {
						starRow ++
					}
					else {
						starRow --
					}
				}

				console.log(starRow, starCol)

				const grid = this.gameBoard.grid
				const el = grid[starRow] && grid[starRow][starCol]

				if (el) {
					this.emit('swap', this.startElement, el)
				}

				this._onMouseUp()
			}
		}
	}

	_onMouseDown(e) {
		const element = this.gameBoard.children.find(child => {
			return child
				.getBounds()
				.containsPoint(e.clientX, e.clientY)
		})

		if (element) {
			this.emit('touchdown', element)

			this.startElement = element

			this.startPos = e.global.clone()
		}
		else {
			this.startPos = null
		}
	}

	_onMouseUp() {
		this.startPos = null
		this.startElement = null
	}
}

export default BoardTouchHandler