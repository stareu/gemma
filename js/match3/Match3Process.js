import AsyncQueue from "../utils/AsyncQueue.js"
import {match3GridToString, match3ApplyGravity } from "./Match3Utility.js"

class Match3Process {
	queue

	match3

	isProcessing = false

	round = 0

	constructor(match3) {
		this.match3 = match3
		this.queue = new AsyncQueue()

		const board = this.match3.board

        this._boardGetMatches = board.grid.getMatches.bind(board.grid)
		this._boardPopCells = board.popCells.bind(board)
	}

	reset() {
        this.isProcessing = false
        this.round = 0
        this.queue.clear()
    }

	pause() {
		this.queue.pause()
	}

	resume() {
		this.queue.resume()
	}

	async start() {
        if (this.isProcessing || !this.match3.isPlaying()) {
			return
		}

        this.isProcessing = true
        this.round = 0
        this.match3.onProcessStart?.()

        console.log('[Match3] ======= PROCESSING START ==========')

        this.runProcessRound()
    }

	async runProcessRound() {
        // Step #1 - Bump sequence number and update stats with new matches found
        this.queue.add(async () => {
            this.round += 1
            console.log(`[Match3] -- SEQUENCE ROUND #${this.round} START`)
            this.updateStats()
        })

        // Step #2 - Process and clear all special matches
        this.queue.add(async () => {
            await this.processSpecialMatches()
        })

        // Step #3 - Process and clear remaining common matches
        this.queue.add(async () => {
            await this.processRegularMatches()
        })

        // Step #4 - Move down remaining pieces in the grid if there are empty spaces in their columns
        this.queue.add(async () => {
            // No await here, to make it run simultaneously with grid refill
            this.applyGravity()
        })

        // Step #5 - Create new pieces that falls from the to to fill up remaining empty spaces
        this.queue.add(async () => {
            await this.refillGrid()
        })

        // Step #6 - Finish up this sequence round and check if it needs a re-run, otherwise stop processing
        this.queue.add(async () => {
            console.log(`[Match3] -- SEQUENCE ROUND #${this.round} FINISH`)
            this.processCheckpoint()
        })
    }

	async updateStats() {
        const matches = this._boardGetMatches()

        if (matches.length) {
			console.log('[Match3] Update stats')

			const matchData = {
				matches,
				combo: this.round
			}

			this.match3.stats.registerMatch(matchData)
			this.match3.onMatch?.(matchData)
		}
    }

	async processSpecialMatches() {
        console.log('[Match3] Process special matches')

        await this.match3.special.process()
    }

    async processRegularMatches() {
        console.log('[Match3] Process regular matches')

        const matches = this._boardGetMatches()
		const popCells = this._boardPopCells()
        const animPromises = []

        for (const match of matches) {
            animPromises.push(popCells(match))
        }

        await Promise.all(animPromises)
    }

	async applyGravity() {
		const board = this.match3.board
        const changes = match3ApplyGravity(board.grid)
        const animPromises = []

        console.log('[Match3] Apply gravity - moved pieces:', changes.length)

        for (const change of changes) {
            const from = change[0]
            const to = change[1]
            const cell = board.getCellByPosition(from)

            if (cell) {
				cell.row = to.row
				cell.column = to.column

				const newPosition = board.getViewPositionByGridPosition(to)

				animPromises.push(piece.animateFall(newPosition.x, newPosition.y))
			}
        }

        await Promise.all(animPromises)
    }

    async refillGrid() {
		const board = this.match3.board
        const animPromises = []
        const piecesPerColumn = {}
		const tileSize = this.match3.config.tileSize
        const newCells = board.fillUpAndGetNewCells()

		newCells.forEach(cell => {
            // Count pieces per column so new pieces can be stacked up accordingly
            if (!piecesPerColumn[cell.column]) {
				piecesPerColumn[cell.column] = 0
			}

            piecesPerColumn[cell.column] += 1

            const x = cell.x
            const y = cell.y
            const columnCount = piecesPerColumn[cell.column]
            const height = board.getHeight()

            cell.y = -height * 0.5 - columnCount * tileSize

            animPromises.push(cell.animateFall(x, y))
		})

        await Promise.all(animPromises)
    }

    async processCheckpoint() {
        // Check if there are any remaining matches or empty spots
        const newMatches = this._boardGetMatches()

        if (newMatches.length || this.match3.board.grid.hasEmptyPositions()) {
            console.log('[Match3] Checkpoint - Another sequence run is needed')
            // Run it again if there are any new matches or empty spaces in the grid
            this.runProcessRound()
        } else {
            console.log('[Match3] Checkpoint - Nothing left to do, all good')
            // Otherwise, finish the grid processing
            this.stop()
        }
    }

	async stop() {
        if (this.isProcessing) {
			this.isProcessing = false
			this.queue.clear()

			console.log('[Match3] Sequence rounds:', this.round)
			console.log('[Match3] Board pieces:', this.match3.board.pieces.length)
			console.log('[Match3] Grid:\n' + match3GridToString(this.match3.board.grid))
			console.log('[Match3] ======= PROCESSING COMPLETE =======')

			this.match3.onProcessComplete?.()
		}
    }
}

export default Match3Process