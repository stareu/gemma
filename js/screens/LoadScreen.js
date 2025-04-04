import { Container, Text, Sprite } from "pixi.js"
import anime from "animejs"
import { Layout } from "@pixi/layout"
import { Events } from "../events/Events"
import { pixiApp } from "../App"

export class LoadScreen extends Layout {
	constructor() {
		super()

		this._cake = Sprite.from('cake')
		this._cake.anchor.set(0.5, 0.5)

		this.addContent({
			cake: {
				content: this._cake,
				styles: {
					anchor: 0,
					position: 'center',
				}
			}
		})
	}

	show() {
		const animation = anime({
			targets: this._cake,
			scale: 1,
			easing: 'easeInOutQuad',
			duration: 2e3,
		})

		return new Promise(resolve => {
			animation.complete = resolve
		})
	}
}