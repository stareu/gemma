import { Container, Sprite, Texture } from "pixi.js"
import { pixiApp } from "../App.js"
import { animate, utils } from "animejs"

const defaultMatch3PieceOptions = {
	/** Piece name, must match one of the textures available */
	name: '',
	/** Attributed piece type in the grid */
	type: 0,
	/** Piece size - width & height - in pixel */
	size: 50,
	/** Set if the piece should be highlighted, like special types */
	highlight: false,
	/** Enable or disable its interactivity */
	interactive: false,
}

class Match3Cell extends Container {
	image
	highlight
	area

	paused
	pressing
	dragging

	type = 0
	name = ''

    pressX = 0
    pressY = 0

    row = 0
    column = 0

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

	setup(options) {
		const opts = Object.assign({}, defaultMatch3PieceOptions, options)

		this.type = opts.type
		this.name = opts.name
	
		this.match3.config.tileSize

		this.x = opts.column * opts.tileSize
        this.y = opts.row * opts.tileSize

		this.row = opts.row
		this.column = opts.column

		this.position = {
			row: opts.row,
			column: opts.column
		}

		this.paused = false
		this.pressing = false
		this.dragging = false
		this.visible = true

		this.alpha = 1

		this.image.alpha = 1
		this.scale.set(1)

		this.image.texture = Texture.from(opts.name)
		this.image.width = opts.size - (opts.highlight ? 2 : 8)
		this.image.height = this.image.width

		this.highlight.visible = opts.highlight

		if (opts.highlight) {
			this.highlight.width = opts.size
			this.highlight.height = opts.size
			this.highlight.alpha = 0.3
		}

		this.area.width = opts.size
		this.area.height = opts.size
		this.area.interactive = opts.interactive
		this.area.cursor = 'pointer'

		this.unlock()
	}

	onPointerDown = e => {
		if (!this.isLocked()) {
			this.pressing = true
			this.dragging = false
			this.pressX = e.globalX
			this.pressY = e.globalY
		}
	}

	onPointerUp = () => {
		if (this.pressing && !this.dragging && !this.isLocked()) {
			this.emit('tap', this)
		}

		this.dragging = false
		this.pressing = false
	}

	// ивент всегда срабатывает, мб добавлять обработчик только после нажатия
	onPointerMove = e => {
		if (!this.pressing || this.isLocked()) {
			return
		}

		const moveX = e.globalX - this.pressX
		const moveY = e.globalY - this.pressY
		const distanceX = Math.abs(moveX)
		const distanceY = Math.abs(moveY)
		// Расстояние по прямой
		const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

		// todo: magic number
		if (distance > 10) {
			this.dragging = true

			let rowTo = this.row
			let columnTo = this.column

			// Например, если двигаем мышь ровно по горизонтали - значит точно смещаем элемент влево/вправо
			// Так же - по вертикали
			// Идеально ровно мы в любом случае не двигаем мышь, поэтому вычисляем куда мы больше двигами - по x или y
			if (distanceX > distanceY) {
				if (moveX < 0) {
					// Move left
					columnTo -= 1
				}
				else {
					// Move right
					columnTo += 1
				}
			}
			else {
				if (moveY < 0) {
					// Move up
					rowTo -= 1
				}
				else {
					// Move down
					rowTo += 1
				}
			}

			this.emit('move', this, rowTo, columnTo)

			// Сразу "отпускаем" нажатие мыши, ведь смещаем всего один элемент, дальше нам не надо
			this.onPointerUp()
		}
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

	isLocked() {
		return !this.interactiveChildren
	}

	isEmpty() {
		return !this.type
	}

	lock() {
		this.interactiveChildren = false
		this.dragging = false
		this.pressing = false
	}

	unlock() {
		this.interactiveChildren = true
	}

	// animations

	async animateSwap(positionTo) {
		this.lock()

		// todo
		// resolveAndKillTweens(this)


		// window.keks = () => {
		// 	utils.remove(this.position)
		// }

		await animate(this.position, {
			x: positionTo.x,
			y: positionTo.y,
			duration: 200,
			ease: 'outQuad'
		}).then()

		this.unlock()
	}

	async animateFall(x, y) {
		this.lock()

		// resolveAndKillTweens(this.position)

		await animate(this.position, {
			x,
			y,
			duration: 500,
			ease: 'outBounce'
		}).then()

		this.unlock()
	}

	async animatePop() {
		this.lock()

		// resolveAndKillTweens(this.image)

		await animate(this.image, {
			alpha: 0,
			duration: 500,
		}).then()

		this.visible = false
	}

	async animateSpawn() {
		this.lock()

		// resolveAndKillTweens(this.scale)

		this.scale.set(2)
		this.visible = true

		const duration = 0.2

		// gsap.to(this.scale, {
		// 	x: 1,
		// 	y: 1,
		// 	duration,
		// 	ease: 'back.out'
		// })

		this.unlock()
	}

	killTweens() {
		// resolveAndKillTweens(this)
		// resolveAndKillTweens(this.position)
		// resolveAndKillTweens(this.scale)
		// resolveAndKillTweens(this.image)
	}

	pause() {
		this.paused = true

		// pauseTweens(this)
		// pauseTweens(this.position)
		// pauseTweens(this.scale)
		// pauseTweens(this.image)
	}

	resume() {
		this.paused = false

		// resumeTweens(this)
		// resumeTweens(this.position)
		// resumeTweens(this.scale)
		// resumeTweens(this.image)
	}
}

export default Match3Cell