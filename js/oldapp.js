import { Application, Sprite, Assets, Texture, Container, Spritesheet, AnimatedSprite } from 'pixi.js';
import { Layout } from "@pixi/layout";
import { Viewport } from 'pixi-viewport'
import { Fit } from './layout.js';

const APP_WIDTH =  1920
const APP_HEIGHT = 900

class App {
	/** @type { Viewport } */
	viewport
	/** @type { Application } */
	pixiApp
	/** @type { Layout } */
	rootLayout

	async init() {
		const app = this.pixiApp = new Application()

		await app.init({
			width: APP_WIDTH,
			height: APP_HEIGHT,
			background: '#fff',
			resizeTo: window,
			resolution: window.devicePixelRatio || 1,
		})

		document.body.appendChild(app.canvas)

		app.stage.addChild(Fit().init({ width: 700, height: 700 }))
		// this._updateSizes()

		// await this._createLayout()

		// this._initEvents()
	}

	_updateSizes() {
		const innerWidth = window.innerWidth
		const innerHeight = window.innerHeight
		const scale = Math.min(innerWidth / APP_WIDTH, innerHeight / APP_HEIGHT)

		this.sizes = {
			innerWidth,
			innerHeight,
			scale
		}
	}

	resize() {
		this._updateSizes()
		const { innerWidth, innerHeight, scale } = this.sizes

		this.pixiApp.canvas.style.width = `${innerWidth}px`
		this.pixiApp.canvas.style.height = `${innerHeight}px`
	  
		window.scrollTo(0, 0)

		this.pixiApp.renderer.resize(innerWidth, innerHeight)
		
		// this.rootLayout.getChildByID('innerBox').setStyles({
		// 	position: 'leftBottom',
		// 	backgroundColor: 'rgba(255,255,255,.5)',
		// 	width: 1600,
		// 	height: 50
		// })

		this.rootLayout.width = innerWidth
		this.rootLayout.height = innerHeight

		this.rootLayout.scale.set(scale)
		this.rootLayout.position.set((innerWidth - this.rootLayout.width * scale) / 2, (innerHeight - this.rootLayout.height * scale) / 2)
	}

	async _createLayout() {
		await Assets.load([
			{
				alias: 'home1',
				src: './img/home1.jpg'
			},
			{
				alias: 'heroIMG',
				src: './img/hero.png'
			}
		])

		const wallpaper = Sprite.from('home1')

		wallpaper.height = wallpaper.height * (APP_WIDTH / wallpaper.width)
		wallpaper.width = APP_WIDTH

		this.rootLayout = new Layout({
			content: {
				wallpaper: {
					content: wallpaper,
					styles: {
						position: 'center',
					}
				},
				innerBox: {
					content: ' '
					// content: {
					// 	hero: await this._createHero()
					// }
				}
			},
			styles: {
				overflow: 'hidden'
			}
		})
	
		this.pixiApp.stage.addChild(this.rootLayout)
	}

	_initEvents() {
		const resizeHandler = this.resize.bind(this)
		window.addEventListener('resize', resizeHandler)
		resizeHandler()
	}

	async _createHero() {
		const hero = await Assets.load('./img/hero.json')

		await hero.parse();

		const anim = new AnimatedSprite(hero.animations.g)
		hero.animations.g.shift()

		// const anim2 = new AnimatedSprite(hero.animations.g)

		// anim2.animationSpeed = 0.05
		// anim2.play()

		anim.height = anim.height * (627 / anim.width)
		anim.width = 627

		return {
			content: anim,
			styles: {
				position: 'rightBottom'
			}
		}
	}
}

export default App