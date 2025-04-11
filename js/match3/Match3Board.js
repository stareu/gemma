import { Container } from "pixi.js"
import { match3GetBlocks } from "./Match3Config.js"
import { pool } from "../utils/pool.js"
import Match3Cell from "./Match3Cell.js"
import BoardGrid from "./BoardGrid.js"

class Match3Board {
	match3

	cells = []
	cellsContainer

	rows
	columns
	tileSize

	/** Все типы ячеек */
	cellTypes

	/** @type { BoardGrid } */
	grid

	constructor(match3) {
        this.match3 = match3

        this.cellsContainer = new Container()
        this.match3.addChild(this.cellsContainer)
	}

	setup(config) {
		this.rows = config.rows
		this.columns = config.columns
		this.tileSize = config.tileSize

		const blocks = match3GetBlocks(config.mode)

		this.cellTypes = {}

		blocks.forEach((blockName, blockIndex) => {
			const blockType = blockIndex + 1

            this.cellTypes[blockType] = blockName
		})

		// todo: exclude specials

		// Только обычные типы ячеек (без specials или других)
		const cellCommonTypes = Object.keys(this.cellTypes)

		this.grid = new BoardGrid(this.rows, this.columns, cellCommonTypes)

		const actions = this.match3.actions

		this._actionMove = actions.actionMove.bind(actions)
		this._actionTap = actions.actionTap.bind(actions)

		const createCell = this.createCell.bind(this)

		this.grid.forEach(createCell)
	}

	// Создание ячеек поля (здесь это cell)
	createCell(row, column, cellType) {
        const name = this.cellTypes[cellType]
        const cell = pool.get(Match3Cell)

		// todo: мб сделать один обработчик
		cell.on('move', this._actionMove)
        cell.on('tap', this._actionTap)

		cell.setup({
            name,
			row,
			column,
            type: cellType,
            tileSize: this.tileSize,
            interactive: true,
            // highlight: this.match3.special.isSpecial(cellType),
        })

		this.cells.push(cell)
        this.cellsContainer.addChild(cell)

		return cell
	}

	async spawnPiece(position, pieceType) {
        // const oldPiece = this.getPieceByPosition(position)

        // if (oldPiece) {
		// 	this.disposePiece(oldPiece)
		// }

        // match3SetPieceType(this.grid, position, pieceType)

        // if (!pieceType) {
		// 	return
		// }

        // const piece = this.createCell(position, pieceType)

        // await piece.animateSpawn()
    }

	// Скрытие ячейки
	async popCell(position, causedBySpecial = false) {
        const cell = this.getCellByPosition(position)

        if (!cell.type || !cell) {
			return
		}

        const isSpecial = this.match3.special.isSpecial(cell.type)
        const combo = this.match3.process.round

		this.grid.set(cell.row, cell.column, 0)

        const popData = {
			cell,
			type: cell.type,
			combo,
			isSpecial,
			causedBySpecial
		}

        this.match3.stats.registerPop(popData)
        this.match3.onPop?.(popData)

        if (this.cells.includes(cell)) {
            this.cells.splice(this.cells.indexOf(cell), 1);
        }

        await cell.animatePop()

        this.disposeCell(cell)

        // await this.match3.special.trigger(type, position)
    }

	async popCells(positions, causedBySpecial = false) {
        const animPromises = []

        for (const position of positions) {
            animPromises.push(this.popCell(position, causedBySpecial))
        }

        await Promise.all(animPromises)
    }

	getCellByPosition(row, column) {
		return this.cells.find(cell => cell.row === row && cell.column === column)
    }

	getWidth() {
        return this.tileSize * this.columns
    }

    getHeight() {
        return this.tileSize * this.rows
    }
	
    pause() {
		this.cells.forEach(cell => cell.pause())
    }

    resume() {
		this.cells.forEach(cell => cell.resume())
    }

    bringToFront(cell) {
        this.cellsContainer.addChild(cell)
    }

    reset() {
		this.cells.forEach(cell => {
			this.disposeCell(cell)
		})

        this.cells.length = 0
    }

	fillUpNewCells() {
		const grid = this.grid
		const rows = grid.length
		const columns = grid[0].length
		const newCells = []

		// Создаём временный grid с рандомным заполнением
		// И для оригинальной grid заполняем пустые ячейки
		// mb todo: здесь нет гарантии, что при заполнении будут match'и
		const tempGrid = this._createGrid(rows, columns, this.grid.types)
	
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				if (!grid[r][c]) {
					grid[r][c] = tempGrid[r][c]

					newCells.push(this.getCellByPosition(r, c))
				}
			}
		}
	
		return newCells.reverse()
	}

	disposeCell(cell) {
        if (this.cells.includes(cell)) {
            this.cells.splice(this.cells.indexOf(cell), 1);
        }

        if (cell.parent) {
            cell.parent.removeChild(cell);
        }

        pool.giveBack(cell);
    }
}

export default Match3Board