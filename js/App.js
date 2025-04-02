import { Application, Sprite, Assets, Texture, Container, Spritesheet, Graphics } from 'pixi.js'
import anime from 'animejs'
import { Layout } from '@pixi/layout'

const APP_WIDTH =  1366
const APP_HEIGHT = 768

class App {
	/** @type { Application } */
	pixiApp

	async init() {
		const app = this.pixiApp = new Application()

		await app.init({
			width: APP_WIDTH,
			height: APP_HEIGHT,
			background: '#000',
			resizeTo: window,
			resolution: window.devicePixelRatio || 1,
			// skipExtensionImports: true // кастомный импорт нужных модулей
		})

		document.body.appendChild(app.canvas)

		await this._onInit()
		this._initEvents()
	}
	
	_initEvents() {
		const onResize = () => {
			const innerWidth = window.innerWidth
			const innerHeight = window.innerHeight

			this.myCont.setStyles({
				width: innerWidth,
				height: innerHeight
			})

			const gameArea = this.myCont.getChildByID('gameArea')

			let gameScale
			const heightScale = innerHeight / APP_HEIGHT

			if (innerWidth < APP_WIDTH * heightScale) {
				gameScale = innerWidth / APP_WIDTH
			}
			else {
				gameScale = heightScale
			}

			gameArea.setStyles({
				scale: gameScale
			})

			this.myCont.resize(innerWidth, innerHeight)	
			// this.myCont.refresh()
		}

		window.addEventListener('resize', onResize)

		onResize()
	}

	async _onInit() {
		await Assets.load([
			'./img/home1.jpg',
			'./img/sky.jpg'
		])

		const sprite2 = Sprite.from('./img/home1.jpg')
		const sprite = Sprite.from('./img/sky.jpg')
		const gameArea = new Graphics()
			.rect(0, 0, 400, 400)
			.fill('rgba(255,255,255,.5)')

		// const animation = anime({
		// 	targets: sprite,
		// 	x: 500,
		// 	direction: 'alternate',
		// 	easing: 'easeInOutQuad',
		// 	loop: true,
		// 	duration: 1e3,
		// 	autoplay: false
		// })

		// this.pixiApp.ticker.add(ticker => {
		// 	animation.tick(ticker.lastTime)
		// })

		const mycont = this.myCont = new Layout({
			content: {
				gameArea: {
					content: {
						mySprite2: {
							content: sprite2,
							styles: {
								maxWidth: 1920,
								maxHeight: 1080,
							}
						},
						mySprite: {
							content: sprite,
							styles: {
								maxHeight: 200,
								position: 'leftBottom',
							}
						}
					},
					styles: {
						position: 'center',
						width: APP_WIDTH,
						height: APP_HEIGHT,
						background: gameArea,
						overflow: 'hidden'
					}
				},
			}
		})

		this.pixiApp.stage.addChild(mycont)
	}
}

export default App