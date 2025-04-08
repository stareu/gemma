class Match3Actions {
	match3
	isFreeMoves

	constructor(match3) {
		this.match3 = match3
	}

	setup(config) {
		this.isFreeMoves = config.freeMoves
	}

	actionMove(from, to) {
		if (this.match3.isPlaying()) {
			const board = this.match3.board

			const pieceA = board.getPieceByPosition(from)
			const pieceB = board.getPieceByPosition(to)

			if (!pieceA || !pieceB || pieceA.isLocked() || pieceB.isLocked()) {
				return
			}
		}
	}
}

export default Match3Actions