import { match3SwapPieces, match3GetPieceType, match3GetMatches, match3CloneGrid } from "./Match3Utility.js"

class Match3Actions {
	match3
	isFreeMoves

	constructor(match3) {
		this.match3 = match3
	}

	setup(config) {
		this.isFreeMoves = config.freeMoves
	}

	async actionMove(from, to) {
		if (this.match3.isPlaying()) {
			const board = this.match3.board

			const pieceA = board.getPieceByPosition(from)
			const pieceB = board.getPieceByPosition(to)

			if (!pieceA || !pieceB || pieceA.isLocked() || pieceB.isLocked()) {
				return
			}

			// wtf? если сюда пришли, то значит ячейки уже есть, зачем снова проверять, но только по типу?
			const typeA = board.getTypeByPosition(from)
			const typeB = board.getTypeByPosition(to)

			if (!typeA || !typeB) {
				return
			}

			console.log('[Match3] ACTION! Move:', from, 'to:', to)

			await this.swapPieces(pieceA, pieceB)

			this.match3.process.start()
		}
	}

	async swapPieces(pieceA, pieceB) {
		const board = this.match3.board

        const positionA = pieceA.getGridPosition()
        const positionB = pieceB.getGridPosition()

        console.log('[Match3] Swap', positionA, positionB)

        const viewPositionA = board.getViewPositionByGridPosition(positionA)
        const viewPositionB = board.getViewPositionByGridPosition(positionB)

		// Есть совпадения (ряд), иначе ячейка возвращается на своё место обратно
        const valid = this.validateMove(positionA, positionB)

        this.match3.onMove?.({
            from: positionA,
            to: positionB,
            valid,
        })

        if (valid) {
            match3SwapPieces(board.grid, positionA, positionB)

            pieceA.row = positionB.row
            pieceA.column = positionB.column

            pieceB.row = positionA.row
            pieceB.column = positionA.column
        }

        board.bringToFront(pieceA)

        await Promise.all([
            pieceA.animateSwap(viewPositionB.x, viewPositionB.y),
            pieceB.animateSwap(viewPositionA.x, viewPositionA.y),
        ])

        if (!valid) {
            const viewPositionA = board.getViewPositionByGridPosition(positionA)
            const viewPositionB = board.getViewPositionByGridPosition(positionB)

            board.bringToFront(pieceB)

            await Promise.all([
                pieceA.animateSwap(viewPositionA.x, viewPositionA.y),
                pieceB.animateSwap(viewPositionB.x, viewPositionB.y),
            ])
        } else if (this.match3.special.isSpecial(match3GetPieceType(board.grid, positionA))) {
            await board.popPiece(positionA)
        } else if (this.match3.special.isSpecial(match3GetPieceType(board.grid, positionB))) {
            await board.popPiece(positionB)
        }
    }

	validateMove(from, to) {
        if (this.freeMoves) {
			return true
		}

		const boardGrid = this.match3.board.grid

        const type = match3GetPieceType(boardGrid, from)
        const specialFrom = this.match3.special.isSpecial(type)
        const specialTo = this.match3.special.isSpecial(match3GetPieceType(boardGrid, to))

        if (specialFrom || specialTo) {
			return true
		}

        // Clone current grid so we can manipulate it safely
        const tempGrid = match3CloneGrid(boardGrid)

        // Swap pieces in the temporary cloned grid
        match3SwapPieces(tempGrid, from, to)

        // Get all matches created by this move in the temporary grid
        const newMatches = match3GetMatches(tempGrid, [from, to])

        // Only validate moves that creates new matches
        return newMatches.length >= 1
    }

	async actionTap(position) {
        if (this.match3.isPlaying()) {
			const board = this.match3.board

			const piece = board.getPieceByPosition(position)
			const type = board.getTypeByPosition(position)

			if (!piece || !this.match3.special.isSpecial(type) || piece.isLocked()) {
				return
			}

			console.log('[Match3] ACTION! Tap:', position)

			// Только special ячейки
			await board.popPiece(piece)

			this.match3.process.start()
		}
    }
}

export default Match3Actions