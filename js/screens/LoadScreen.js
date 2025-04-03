import { Container, Text } from "pixi.js"
import anime from "animejs"

export class LoadScreen extends Container {
	constructor() {
		super()

		this._message = new Text({
			text: "Приветус",
            style: {
                fill: '#000',
                fontFamily: 'Verdana',
                align: 'center',
            },
		})

		this.addChild(this._message)
	}

	show() {
		const animation = anime({
			targets: this._message,
			x: 500,
			easing: 'easeInOutQuad',
			duration: 1e3,
		})

		return new Promise(resolve => {
			animation.complete = resolve
		})
	}
}