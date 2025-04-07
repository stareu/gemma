import { Container, Text } from "pixi.js"
import { animate } from "animejs"

class GameScore extends Container {
	score = 0

	constructor() {
		super()

		this._label = new Text({
			text: 'Счёт: 0'
		})

		this.addChild(this._label)
	}

	setScore(score) {
		if (!Object.is(this.score, score)) {
			const oldScore = this.score

			this.score = score

			this.playPoints(oldScore)
		}
	}

	playPoints(oldScore) {
		const res = {
			score: oldScore
		}

		animate(res, {
			score: this.score,
			duration: 3e3,
			onUpdate: () => {
				this._label.text = `Счёт: ${ Number(res.score).toFixed() }`
			}
		})
	}
}

export default GameScore