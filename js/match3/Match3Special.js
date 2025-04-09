import { match3GetMatches } from "./Match3Utility.js"

const availableSpecials = {
    // /** Pops out the entire row */
    // 'special-row': Match3SpecialRow,
    // /** Pops out the entire column */
    // 'special-column': Match3SpecialColumn,
    // /** Pops out all pieces of a single type */
    // 'special-colour': Match3SpecialColour,
    // /** Pops out surrounding pieces */
    // 'special-blast': Match3SpecialBlast,
}

class Match3Special {
	match3
	specialTypes = []
	specialHandlers = []

	constructor(match3) {
		this.match3 = match3
	}

    reset() {
        this.specialTypes.length = 0
        this.specialHandlers.length = 0
    }

    isSpecialAvailable(name) {
        return !!availableSpecials[name]
    }

    addSpecialHandler(name, pieceType) {
        if (availableSpecials[name]) {
			this.specialTypes.push(pieceType)
			this.specialHandlers.push(new availableSpecials[name](this.match3, pieceType))
		}
    }

    async process() {
        for (const special of this.specialHandlers) {
            const matches = match3GetMatches(this.match3.board.grid)
            await special.process(matches)
        }
    }

    async trigger(pieceType, position) {
        if (this.isSpecial(pieceType)) {
			for (const special of this.specialHandlers) {
				// todo: refactor, по идее никакой очереди нет, всё тригерится сразу
				await special.trigger(pieceType, position)
			}
		}
    }

    isSpecial(pieceType) {
        return this.specialTypes.includes(pieceType)
    }
}

export default Match3Special