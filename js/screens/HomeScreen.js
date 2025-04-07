import { Container, Sprite, Text, Texture } from "pixi.js"
import { Layout } from "@pixi/layout"
import { Button } from "@pixi/ui"
import { navigation } from "../navigation.js"
import GameScreen from "./GameScreen.js"

class HomeScreen extends Layout {
	constructor() {
		super()

		const rock = new Sprite({
			texture: Texture.from('rock'),
			x: -150,
			y: -150,
			width: 250,
			height: 250
		})

		const text = new Text({
			text: 'Стартовать',
			style: {
				fontSize: 35,
				fill: '#fff',
			},
			x: -140,
			y: -20
		})

		globalThis.text = text

		const sword = Sprite.from('sword')

		const btn = new Container({
			children: [
				sword,
				rock,
				text
			]
		})
		
		sword.anchor.set(0.5, 0.5)
		sword.scale = 0.5
		sword.scale.y = -sword.scale.x
		sword.angle = 90

		text.mask = rock

		this.addContent({
			home: {
				content: btn,
				styles: {
					anchor: 0,
					position: 'center'
				}
			}
		})

		const playBtn = new Button(btn)

		playBtn.onPress.connect(() => {
			playBtn.enabled = false
			navigation.showScreen(GameScreen)
		})
	}

	show() {

	}
}

export default HomeScreen