import { animate } from "animejs"

class AnimationManager {
	animateToPosition(target, position) {
		return animate(target, {
			x: position.x,
			y: position.y,
		}).then()
	}
}

export default AnimationManager