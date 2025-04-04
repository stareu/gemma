import { pixiApp } from "./App.js"
import { Container } from "pixi.js"
import { Layout } from "@pixi/layout"
import { Events } from "./events/Events.js"

class Navigation {
	/** @type { Layout } */
	layout

	background

	currentScreen

	init() {
		this.layout = new Layout({
			id: 'root',
			styles: {
				width: 1920,
				height: 933,
				color: '#000'
			}
		})

		this.layout.label = 'Navigation'

		pixiApp.stage.addChild(this.layout)

		Events.WindowResize.on('change', (width, height) => this.resize(width, height))
	}

	resize(width, height) {
		this.layout.setStyles({
			width,
			height
		})

		this.layout.resize(width, height)
		this.background.resize(width, height)
	}

	setBackground(BackgroundConstructor) {
		this.background = new BackgroundConstructor()

		return this._addAndShowScreen(this.background)
	}

	/** @param { Container } screen */
	async _addAndShowScreen(screen) {
		this.layout.addContent({
			content: screen,
			styles: {
				position: 'leftTop',
				width: '100%',
				height: '100%'
			}
		})

		screen.setStyles && screen.setStyles({
			position: 'leftTop',
			width: '100%',
			height: '100%'
		})

		screen.interactiveChildren = false
		await screen.show()
		screen.interactiveChildren = true
	}

	/** @param { Container } screen */
	async _hideAndRemoveScreen(screen) {
		screen.interactiveChildren = false

		await screen.hide()

		screen.parent.removeChild(screen)
	}

	/** @param { Container } screen */
	async showScreen(Screen) {
		if (this.currentScreen) {
			await this._hideAndRemoveScreen(this.currentScreen)
		}

		this.currentScreen = new Screen()

		await this._addAndShowScreen(this.currentScreen)
	}
}

export const navigation = new Navigation()