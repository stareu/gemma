import { Sprite, Container } from "pixi.js"

class Element extends Container {
	/** @type { string } */
	name

	/** @type { number } */
	nameID

	/** @type { number } */
	row

	/** @type { number } */
	column

	/** @type { Sprite } */
	image

	size

	constructor(config) {
		super()

		this.name = config.name
		this.nameID = config.nameID
		this.row = config.row
		this.column = config.column

		this.image = Sprite.from(config.image)
		this.image.setSize(config.size)

		this.size = config.size

		this.x = config.size * this.column
		this.y = config.size * this.row

		this.addChild(this.image)

		this.interactive = true
		this.image.interactive = true

		this.pivot.set(config.size / 2)
	}
}

export default Element