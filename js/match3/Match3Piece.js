import { Container, Sprite, Texture } from "pixi.js"
import { pixiApp } from "../App.js"

class Match3Piece extends Container {
	image

	constructor() {
		super()

		this.image = new Sprite()
		this.image.anchor.set(0.5)
		this.addChild(this.image)

		this.highlight = Sprite.from('highlight')
        this.highlight.anchor.set(0.5)
        this.addChild(this.highlight)

		const area = this.area = new Sprite(Texture.WHITE)
		area.anchor.set(0.5)
		area.alpha = 0
		this.addChild(area)

		area.on('pointerdown', this.onPointerDown)
        area.on('pointermove', this.onPointerMove)
        area.on('pointerup', this.onPointerUp)
        area.on('pointerupoutside', this.onPointerUp)
        area.on('pointercancel', this.onPointerUp)

		this.onRender = this._renderUpdate.bind(this)
	}

	_renderUpdate() {
		if (!this.paused) {
			if (this.highlight.visible) {
				this.highlight.rotation += pixiApp.ticker.deltaTime * 0.03

				this.image.rotation = Math.sin(pixiApp.ticker.lastTime * 0.01) * 0.1
			} else {
				this.image.rotation = 0
			}
		}
	}
}

export default Match3Piece