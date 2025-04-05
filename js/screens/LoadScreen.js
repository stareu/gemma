import { Container, Text, Sprite, Rectangle, Graphics } from "pixi.js"
import { animate, eases } from "animejs"
import { Layout } from "@pixi/layout"
import { Events } from "../events/Events"
import { pixiApp } from "../App"

class LoadScreen extends Layout {
	constructor() {
		super()

		this._cake = Sprite.from('cake')
		this._cake.anchor.set(0.5, 0.5)

		const sword = this._sword = Sprite.from('sword')
		sword.anchor.set(0.5, 0.5)
		sword.scale = 0.5
		sword.scale.y = -sword.scale.x
		sword.y = -200

		const mask = new Graphics()
			.rect(-400, 0, 800, sword.height)
			.fill('#000')

		sword.mask = mask

		const cakeSword = new Container({
			children: [
				mask,
				sword,
				this._cake
			]
		})

		this.addContent({
			cake: {
				content: cakeSword,
				styles: {
					anchor: 0,
					position: 'center',
				}
			}
		})
	}

	async show() {
		const sword = this._sword
		const cake = this._cake

		const swordAnim = animate(sword, {
			y: 220,
			delay: 1300,
			ease: 'linear',
			duration: 4e3,
		})

		await this._cakeRetch()

		swordAnim.pause()
		await _.sleep(1e3)
		this._cakeRetch()
		await _.sleep(1500)
		swordAnim.resume()

		await swordAnim.then()

		sword.mask.removeFromParent()
		sword.mask = null

		await animate(sword, {
			y: 0,
			x: 400,
			angle: 90,
			duration: 2e3,
			ease: 'inOutBack'
		}).then()

		await animate(sword, {
			x: 600,
			duration: 1e3,
			ease: 'inOutBack'
		}).then()

		animate(sword, {
			x: 0,
			delay: 100,
			duration: 1e3,
			ease: 'outQuart'
		})

		const leftCorner = cake.toGlobal({ x: 0, y: 0 }).x * -1

		await animate(cake, {
			delay: 300,
			x: leftCorner - cake.width / 2,
			duration: 1e3,
			ease: 'outQuart'
		}).then()
	}

	_cakeRetch() {
		const cake = this._cake

		const cakeScale = animate(cake.scale, {
			delay: 700,
			x: [ 1, 0.9, 1.1 ],
			y: [ 1, 1.1, 0.8 ],
			duration: 1e3,
		})

		const cakeShake = animate(cake, {
			angle: [ 0, 2, -2 ],
			duration: 70,
			delay: 1300,
			easing: 'linear',
			direction: 'alternate',
			loop: true
		})

		return new Promise(resolve => {
			setTimeout(() => {
				cakeShake.cancel()
				cakeShake.seek()

				cakeScale.reverse()
				
				resolve()
			}, 3500)
		})
	}
}

export default LoadScreen