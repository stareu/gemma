import { pixiApp } from "./App.js"
import { Container } from "pixi.js"
import { Layout } from "@pixi/layout"
import { Events } from "./events/Events.js"

class Navigation {
	/** @type { Layout } */
	layout

	background

	currentScreen

	setBackground(BackgroundConstructor) {
		this.background = new BackgroundConstructor()

		this.layout = new Layout()

		pixiApp.stage.addChild(this.layout)

		return this._addAndShowScreen(this.background)
	}

	/** @param { Container } screen */
	async _addAndShowScreen(screen) {
		this.layout.addChild(screen)

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