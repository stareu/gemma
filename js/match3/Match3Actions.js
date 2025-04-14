class Match3Actions {
	match3
	isFreeMoves

	constructor(match3) {
		this.match3 = match3
	}

	setup(config) {
		this.isFreeMoves = config.freeMoves
	}

	async actionMove(cell, rowTo, columnTo) {
		if (this.match3.isPlaying()) {
			const board = this.match3.board

			const cellA = cell
			const cellB = board.getCellByPosition(rowTo, columnTo)

			// Ячейки есть и они не залочены и не пустые
			if (cellA && cellB && !cellA.isLocked() && !cellB.isLocked() && !cellA.isEmpty() && !cellB.isEmpty()) {
				await this.swapCells(cellA, cellB)

				this.match3.process.start()
			}
		}
	}

	async swapCells(cellA, cellB) {
		const board = this.match3.board

        const positionA = cellA.position
        const positionB = cellB.position

		// Есть совпадения (ряд), иначе ячейка возвращается на своё место обратно
        const isValidMove = this.validateMove(cellA, cellB)

        if (isValidMove) {
			board.grid.swap(cellA, cellB)

            cellA.row = positionB.row
            cellA.column = positionB.column

            cellB.row = positionA.row
            cellB.column = positionA.column
        }

        board.bringToFront(cellA)

        await Promise.all([
            cellA.animateSwap(cellB.position),
            cellB.animateSwap(cellA.position)
        ])

        if (!isValidMove) {
            board.bringToFront(cellB)

            await Promise.all([
                cellA.animateSwap(cellB.position),
                cellB.animateSwap(cellA.position)
            ])
        }
		// else if (this.match3.special.isSpecial(match3GetPieceType(board.grid, positionA))) {
        //     await board.popPiece(positionA)
        // }
		// else if (this.match3.special.isSpecial(match3GetPieceType(board.grid, positionB))) {
        //     await board.popPiece(positionB)
        // }
    }

	validateMove(cellA, cellB) {
        if (this.freeMoves) {
			return true
		}

		const boardGrid = this.match3.board.grid

        // const type = cellA.type
        // const specialFrom = this.match3.special.isSpecial(type)
        // const specialTo = this.match3.special.isSpecial(match3GetPieceType(boardGrid, to))

        // if (specialFrom || specialTo) {
		// 	return true
		// }

		if (cellA.type !== undefined && cellB.type !== undefined) {
			// todo: Клонируем, свайпаем и проверяем. Но вероятно можно и без клона
			const newMatches = boardGrid
				.clone()
				.swap(cellA, cellB)
				.getMatches([ cellA.position, cellB.position ])

			// Если после свапа ячеек появились мэтчи в позициях cellA или cellB

			return newMatches.length >= 1
		}
    }

	async actionTap(cell) {
        if (this.match3.isPlaying()) {
			const board = this.match3.board

			// Только special ячейки
			if (cell && this.match3.special.isSpecial(cell.type) && !cell.isLocked()) {
				await board.popPiece(cell)

				this.match3.process.start()
			}
		}
    }
}

export default Match3Actions