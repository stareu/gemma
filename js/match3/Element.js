import { Sprite, Container } from "pixi.js"
import { RadialBlurFilter } from "pixi-filters"

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

		// const filter = new RadialBlurFilter({
		// 	angle: 20,
		// 	center: { x: config.size / 2, y: config.size / 2 },
		// 	kernelSize: 3,
		// 	radius: 160
		// })

		// this.onRender = () => {
		// 	if (filter.angle < 180) {
		// 		filter.angle += 1
		// 		// filter.radius += 0.5
		// 	}
		// }

		// this.filters = [ filter ]
	}
}

export default Element