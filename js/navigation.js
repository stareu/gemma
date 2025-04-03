import { pixiApp } from "./App.js"
import { Container } from "pixi.js"

class Navigation {
	container = new Container()

	background

	setBackground(BackgroundConstructor) {
		this.background = new BackgroundConstructor()

		this._addAndShowScreen(this.background)
	}

	/** @param { Container } screen */
	async _addAndShowScreen(screen) {
		if (!this.container.parent) {
			pixiApp.stage.addChild(this.container)
		}

		this.container.addChild(screen)

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
}

export const navigation = new Navigation()