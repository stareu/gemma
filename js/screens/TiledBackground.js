import { Container, Texture, TilingSprite } from "pixi.js"
import { pixiApp } from "../App.js"
import { Events } from "../events/Events.js"

export class TiledBackground extends Container {
	constructor() {
		super()

		this._sprite = new TilingSprite({
			texture: Texture.from('background'),
			width: pixiApp.screen.width,
			height: pixiApp.screen.height
		})

		this.addChild(this._sprite)

		this.onRender = ((a, b) => {
			const delta = pixiApp.ticker.deltaTime

			this._sprite.tilePosition.x -= 1 * delta
			this._sprite.tilePosition.y -= 1 * delta
			this._sprite.tileRotation = -Math.PI * 0.15
		})

		Events.WindowResize.on('change', (width, height) => {
			this._sprite.width = width
			this._sprite.height = height
		})
	}

	show() {}
}