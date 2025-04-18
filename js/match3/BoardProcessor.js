class BoardProcessor {
	/** @type { import('./GameBoard').default } */
	gameBoard

	/** @type { import('./AnimationManager').default } */
	animation

	constructor(gameBoard, animation) {
		this.gameBoard = gameBoard
		this.animation = animation
	}

	async process() {
		await this._hideMatches()

		await this._applyGravity()

		await this._fillAndShow()

		const matches = this.gameBoard.findMatches()

		if (matches.length) {
			await this.process()
		}
	}

	_hideMatches() {
		const promises = [] 
		const matches = this.gameBoard.findMatches()
		const hideElement = this.animation.hideElement.bind(this.animation)

		this.gameBoard.removeMatches(matches)

		matches.forEach(match => {
			match.forEach(element => {
				const hidePromise = hideElement(element)
					.then(() => element.destroy())

				promises.push(hidePromise)
			})
		})

		return Promise.all(promises)
	}

	_applyGravity() {
		const changedElements = this.gameBoard.applyGravity()
		const animateElementPosition = this.animation.animateElementPosition.bind(this.animation)

		const promises = changedElements.map(animateElementPosition)

		return Promise.all(promises)
	}

	_fillAndShow() {
		const gameBoard = this.gameBoard
		const newElements = this.gameBoard.fillEmpty()
		const showElement = this.animation.showElement.bind(this.animation)
		
		const promises = newElements.map(element => {
			gameBoard.addChild(element)

			return showElement(element)
		})

		return Promise.all(promises)
	}
}

export default BoardProcessor