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

		window.board = this
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

	getByRowCol(r, c) {
		return this.grid[r] && this.grid[r][c]
	}

	findMatches() {
		let currentMatch

		const matches = []
		const grid = this.grid

		const getMatches = (r, c, isVertical = false) => {
			const element = grid[r][c]
			const elementNameID = element.nameID

			if (currentMatch && currentMatch[0].nameID === elementNameID) {
				currentMatch.push(element)
			}
			else {
				let next1Element
				let next2Element

				if (isVertical) {
					next1Element = grid[r + 1] && grid[r + 1][c]
					next2Element = grid[r + 2] && grid[r + 2][c]
				}
				else {
					next1Element = grid[r][c + 1]
					next2Element = grid[r][c + 2]
				}

				if (next1Element && next2Element && next1Element.nameID === elementNameID && next2Element.nameID === elementNameID) {
					currentMatch = [ element ]

					matches.push(currentMatch)
				}
				else {
					currentMatch = null
				}
			}
		}

		for (let r = 0; r < this.rows; r ++) {
			currentMatch = null

			for (let c = 0; c < this.columns; c ++) {
				getMatches(r, c)
			}
		}

		for (let c = 0; c < this.columns; c ++) {
			currentMatch = null

			for (let r = 0; r < this.rows; r ++) {
				getMatches(r, c, true)
			}
		}

		return matches
	}
}

export default GameBoard