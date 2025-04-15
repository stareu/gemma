import { Application, Assets } from 'pixi.js'
import { navigation } from './navigation.js'
import LoadScreen from './screens/LoadScreen.js'
import HomeScreen from './screens/HomeScreen.js'
import { TiledBackground } from './screens/TiledBackground.js'
import { Events } from './events/Events.js'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration' // ES 2015

import * as _ from 'radashi'
import { engine } from 'animejs'

dayjs.extend(duration)

globalThis._ = _

engine.useDefaultMainLoop = false

export const pixiApp = new Application()

// todo: в package.json перенести зависимости из дев в обычные
class App {
	/** @type { Application } */
	pixiApp

	async init() {
		await this._initPixiApp()

		Array.prototype.random = function() {
			const index = Math.floor(Math.random() * this.length)
		
			return this[index]
		}

		pixiApp.ticker.add(() => engine.update())

		this._initEvents()

		await this._initAssets()

		navigation.init()

		globalThis.appNavigation = navigation

		await navigation.setBackground(TiledBackground)
		// await navigation.showScreen(LoadScreen)
		await navigation.showScreen(HomeScreen)

		this._resize()
	}

	async _initPixiApp() {
		const app = this.pixiApp = pixiApp

		await app.init({
			resolution: 1,
			backgroundColor: '#ccc'
			// skipExtensionImports: true // кастомный импорт нужных модулей
		})

		document.body.appendChild(app.canvas)
	}

	_initEvents() {
		this._initResize()
	}

	_initResize() {
		window.addEventListener('resize', this._resize.bind(this))

		this._resize()
	}

	_resize() {
		const app = this.pixiApp
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const minWidth = 375;
		const minHeight = 700;

		// Если не достигнуты миниальные значения, то и canvas и view будут иметь одинаковый размер
		// Если width или height меньше минимальных, то будет scale renderer view (по высоте или ширине), а canvas всё так же растянется на весь экран
		const scaleX = minWidth > windowWidth ? minWidth / windowWidth : 1;
		const scaleY = minHeight > windowHeight ? minHeight / windowHeight : 1;
		const scale = Math.max(scaleX, scaleY);

		// Если экран больше минимальных значений, то всегда будет 1
		// Если экран меньше, то width/height БУДУТ равны minWidth/minHeight
		const width = windowWidth * scale;
		const height = windowHeight * scale;

		// canvas растянется до размеров width и height (то есть до минимального размера контейнера игры по ширине или высоте)
		// То есть, если экран 400px, то canvas будет шириной minWidth, что выходит за рамки.
		// Поэтому ещё ниже уменьшаем итоговое изображение через стили, чтобы вместить точно по ширине/высоте
		app.renderer.resize(width, height)

		app.renderer.canvas.style.width = `${windowWidth}px`;
		app.renderer.canvas.style.height = `${windowHeight}px`;

		window.scrollTo(0, 0)

		Events.WindowResize.emit('change', width, height)

		// TODO: выше для узких экранов сначала создаётся canvas бОльшего размера и уменьшается до размера экрана
		// Якобы лучше, если всегда указывать width, height канваса по размеру экрана (не через style), а скейлить уже некий внутренний контейнер
		// Попробовать потом сделать и сравнить

		// todo: почему при изменении height спрайт смещается так, будто у него точка опоры снизу, а не 0,0
		// app.renderer.resize(900, 900)
		// app.canvas.width = 400
		// app.canvas.height = 400
	}

	async _initAssets() {
		const response = await fetch('assets/assets-manifest.json')
		const manifest = await response.json()

		await Assets.init({
			manifest,
			basePath: 'assets'
		})

		await Assets.loadBundle('preload')
	}
}

export default App