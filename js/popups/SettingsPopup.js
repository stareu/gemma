import { Container, Texture, Sprite, Graphics } from "pixi.js"
import { Layout } from "@pixi/layout"

class SettingsPopup extends Layout {
	constructor() {
		super()

		const overlay = Sprite.from(Texture.WHITE)
		overlay.tint = '#000'

		this.addContent({
			overlay: {
				content: new Container(),
				styles: {
					background: overlay,
					width: '100%',
					height: '100%',
					backgroundSize: 'stretch',
					opacity: 0.5,
				}
			},
		})
	}

	show() {}
}

export default SettingsPopup