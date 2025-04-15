import { Container } from "pixi.js"
import Element from "./Element"

class GameBoard extends Container {
	grid

	rows
	columns

	constructor(config) {
		super()

		this.config = config

		this.rows = config.rows
		this.columns = config.columns

		this._createElements()
	}

	_createElements() {
		const grid = this.grid = []

		for (let r = 0; r < this.rows; r ++) {
			const row = grid[r] = []

			for (let c = 0; c < this.columns; c ++) {
				const config = this._createElementConfig(r, c)
				const element = new Element(config)

				row.push(element)

				this.addChild(element)
			}
		}
	}

	_createElementConfig(row, column) {
		const grid = this.grid
		const allowedElements = this.config.modes[this.config.mode]

		const hasMatchesByRowOrColumn = element => {
			const cPrev1 = grid[row][column - 1]
			const cPrev2 = grid[row][column - 2]

			const matchColumn = cPrev1 && cPrev1.name === element && cPrev2 && cPrev2.name === element

			const rPrev1 = grid[row - 1] && grid[row - 1][column]
			const rPrev2 = grid[row - 2] && grid[row - 2][column]

			const matchRow = rPrev1 && rPrev1.name === element && rPrev2 && rPrev2.name === element

			return matchColumn || matchRow
		}

		const getRandomElement = () => {
			let randomElement = allowedElements.random()

			while (hasMatchesByRowOrColumn(randomElement)) {
				randomElement = allowedElements.random()
			}

			return randomElement
		}

		const name = getRandomElement()

		return {
			name,
			nameID: this.config.elements[name].id,
			row,
			column,
			size: this.config.elementSize,
			image: name // todo: мб изменить ?
		}
	}

	forEach(cb) {
		for (let r = 0; r < this.rows; r ++) {
			for (let c = 0; c < this.columns; c ++) {
				cb(this.grid[r][c])
			}
		}
	}

	findMatches() {
		for (let r = 0; r < this.rows; r ++) {
			for (let c = 0; c < this.columns; c ++) {
				const element = this.grid[r][c]
			}
		}
	}
}

export default GameBoard