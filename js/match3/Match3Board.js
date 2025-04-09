import { Container, Graphics } from "pixi.js"
import { match3GetBlocks } from "./Match3Config.js"
import { match3CreateGrid, match3ForEach, match3GetPieceType, match3SetPieceType } from "./Match3Utility.js"
import { pool } from "../utils/pool.js"
import Match3Piece from "./Match3Piece.js"

class Match3Board {
	match3

	pieces = []
	piecesContainer
	piecesMask

	rows
	columns
	tileSize

	typesMap
	commonTypes

	grid

	constructor(match3) {
        this.match3 = match3

        this.piecesContainer = new Container()
        this.match3.addChild(this.piecesContainer)

        // this.piecesMask = new Graphics()
		// 	.rect(-2, -2, 4, 4)
		// 	.fill({ color: 0xff0000, alpha: 0.5 })

        // this.match3.addChild(this.piecesMask)
        // this.piecesContainer.mask = this.piecesMask
	}

	setup(config) {
		this.rows = config.rows
		this.columns = config.columns
		this.tileSize = config.tileSize

		// this.piecesMask.width = this.getWidth()
        // this.piecesMask.height = this.getHeight()

        this.piecesContainer.visible = true

		const blocks = match3GetBlocks(config.mode)
		const special = this.match3.special

		this.typesMap = {}
		this.commonTypes = []

		blocks.forEach((blockName, blockIndex) => {
			const blockType = blockIndex + 1

			if (special.isSpecialAvailable(blockName)) {
                special.addSpecialHandler(blockName, blockType)
            } else {
                this.commonTypes.push(blockType)
            }

            this.typesMap[blockType] = blockName
		})

		this.grid = match3CreateGrid(this.rows, this.columns, this.commonTypes)

		match3ForEach(this.grid, (gridPosition, type) => {
            this.createPiece(gridPosition, type)
        })

		// todo: где гарантия, что можно сделать match?
	}

	// Создание ячеек поля (здесь это piece)
	createPiece(position, pieceType) {
        const name = this.typesMap[pieceType]
        const piece = pool.get(Match3Piece)
        const viewPosition = this.getViewPositionByGridPosition(position)

		const actions = this.match3.actions
		const actionMove = actions.actionMove.bind(actions)
		const actionTap = actions.actionTap.bind(actions)

		piece.onMove = actionMove
        piece.onTap = actionTap

		piece.setup({
            name,
            type: pieceType,
            size: this.match3.config.tileSize,
            interactive: true,
            highlight: this.match3.special.isSpecial(pieceType),
        })

        piece.row = position.row
        piece.column = position.column
        piece.x = viewPosition.x
        piece.y = viewPosition.y

		this.pieces.push(piece)
        this.piecesContainer.addChild(piece)

		return piece
	}

	async spawnPiece(position, pieceType) {
        const oldPiece = this.getPieceByPosition(position)

        if (oldPiece) {
			this.disposePiece(oldPiece)
		}

        match3SetPieceType(this.grid, position, pieceType)

        if (!pieceType) {
			return
		}

        const piece = this.createPiece(position, pieceType)

        await piece.animateSpawn()
    }

	async popPiece(position, causedBySpecial = false) {
        const piece = this.getPieceByPosition(position)
        const type = match3GetPieceType(this.grid, position)

        if (!type || !piece) {
			return
		}

        const isSpecial = this.match3.special.isSpecial(type)
        const combo = this.match3.process.round

        match3SetPieceType(this.grid, position, 0)

        const popData = { piece, type, combo, isSpecial, causedBySpecial }

        this.match3.stats.registerPop(popData)
        this.match3.onPop?.(popData)

        if (this.pieces.includes(piece)) {
            this.pieces.splice(this.pieces.indexOf(piece), 1);
        }

        await piece.animatePop()

        this.disposePiece(piece)

        await this.match3.special.trigger(type, position)
    }

	async popPieces(positions, causedBySpecial = false) {
        const animPromises = []

        for (const position of positions) {
            animPromises.push(this.popPiece(position, causedBySpecial))
        }

        await Promise.all(animPromises)
    }

	getPieceByPosition(position) {
		return this.pieces.find(piece => piece.row === position.row && piece.column === position.column)
    }

	// Получаем x, y позиции, только хз зачем offset'ы
	getViewPositionByGridPosition(position) {
		const offsetX = ((this.columns - 1) * this.tileSize) / 2
		const offsetY = ((this.rows - 1) * this.tileSize) / 2
		const x = position.column * this.tileSize - offsetX
		const y = position.row * this.tileSize - offsetY

		return { x, y }
	}

	getTypeByPosition(position) {
        return match3GetPieceType(this.grid, position)
    }

	getWidth() {
        return this.tileSize * this.columns
    }

    getHeight() {
        return this.tileSize * this.rows
    }
	
    pause() {
		this.pieces.forEach(piece => piece.pause())
    }

    resume() {
		this.pieces.forEach(piece => piece.resume())
    }

    bringToFront(piece) {
        this.piecesContainer.addChild(piece)
    }

    reset() {
        let i = this.pieces.length

        while (i--) {
            const piece = this.pieces[i]
            this.disposePiece(piece);
        }

        this.pieces.length = 0
    }

	disposePiece(piece) {
        if (this.pieces.includes(piece)) {
            this.pieces.splice(this.pieces.indexOf(piece), 1);
        }

        if (piece.parent) {
            piece.parent.removeChild(piece);
        }

        pool.giveBack(piece);
    }
}

export default Match3Board