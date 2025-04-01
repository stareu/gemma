import { Application, Sprite, Assets, Texture, Container, Spritesheet, Graphics } from 'pixi.js'
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

		const sprite = Sprite.from('./img/home1.jpg')
		const sprite2 = Sprite.from('./img/sky.jpg')
		const gameArea = new Graphics()
			.rect(0, 0, 400, 400)
			.fill('rgba(255,255,255,.5)')

		const mycont = this.myCont = new Layout({
			content: {
				gameArea: {
					content: {
						mySprite: {
							content: sprite,
							styles: {
								maxHeight: 200,
								position: 'rightBottom',
								// anchor: 0.5
							}
						},
						mySprite2: {
							content: sprite2,
							styles: {
								maxHeight: 200,
							}
						}
					},
					styles: {
						position: 'center',
						width: 400,
						height: 400,
						background: gameArea
					}
				},
			}
		})

		this.pixiApp.stage.addChild(mycont)
	}
}

export default App