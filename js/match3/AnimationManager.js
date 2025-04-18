import { animate } from "animejs"

class AnimationManager {
	animateSwapElements(el1, el2) {
		animate(el1.position, {
			x: el2.position.x,
			y: el2.position.y,
			duration: 300
		})

		return animate(el2.position, {
			x: el1.position.x,
			y: el1.position.y,
			duration: 300
		}).then()
	}

	hideElement(element) {
		return animate(element, {
			alpha: 0,
			duration: 300
		}).then()
	}

	animateElementPosition(element) {
		return animate(element.position, {
			x: element.column * element.size,
			y: element.row * element.size,
			duration: 600,
			ease: 'outBounce'
		}).then()
	}

	/** @param { import('./Element').default } element */
	showElement(element) {
		element.scale = 0

		return animate(element.scale, {
			x: 1,
			y: 1,
			duration: 200,
			ease: 'linear'
		}).then()
	}
}

export default AnimationManager