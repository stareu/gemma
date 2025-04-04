import { Container, Text, Sprite } from "pixi.js"
import anime from "animejs"
import { Layout } from "@pixi/layout"
import { Events } from "../events/Events"
import { pixiApp } from "../App"

export class LoadScreen extends Layout {
	constructor() {
		super({
			styles: {
				width: '100%',
			}
		})

		this._cake = Sprite.from('cake')

		// this.addContent({
		// 	cake: {
		// 		content: this._cake,
		// 		styles: {
		// 			position: 'center'
		// 		}
		// 	}
		// })
	}

	show() {
		// const animation = anime({
		// 	targets: this._message,
		// 	x: 500,
		// 	easing: 'easeInOutQuad',
		// 	duration: 1e3,
		// })

		// return new Promise(resolve => {
		// 	animation.complete = resolve
		// })
	}
}