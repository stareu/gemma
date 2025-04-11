export function match3ComparePositions(a, b) {
    return a.row === b.row && a.column === b.column
}

export function match3IncludesPosition(positions, position) {
    for (const p of positions) {
        if (match3ComparePositions(p, position)) {
			return true
		}
    }

    return false;
}

export function match3IsValidPosition(grid, position) {
    const rows = grid.length;
    const cols = grid[0].length;

    return position.row >= 0 && position.row < rows && position.column >= 0 && position.column < cols;
}

export function match3ApplyGravity(grid) {
    const rows = grid.length
    const columns = grid[0].length
    const changes = []

    for (let r = rows - 1; r >= 0; r--) {
        for (let c = 0; c < columns; c++) {
            let position = { row: r, column: c }
            const belowPosition = { row: r + 1, column: c }
            let hasChanged = false

            // Skip this one if position below is out of bounds
            if (!match3IsValidPosition(grid, belowPosition)) {
				continue
			}

            // Retrive the type of the position below
            let belowType = match3GetPieceType(grid, belowPosition)

            // Keep moving the piece down if position below is valid and empty
            while (match3IsValidPosition(grid, belowPosition) && belowType === 0) {
                hasChanged = true

                match3SwapPieces(grid, position, belowPosition)

                position = Object.assign({}, belowPosition)

                belowPosition.row += 1

                belowType = match3GetPieceType(grid, belowPosition)
            }

            if (hasChanged) {
                // Append a new change if position has changed [<from>, <to>]
                changes.push([
					{ row: r, column: c },
					position
				])
            }
        }
    }

    return changes;
}

export function match3GridToString(grid) {
    const lines = [];

    for (const row of grid) {
        const list = row.map((type) => String(type).padStart(2, '0'));
        lines.push('|' + list.join('|') + '|');
    }

    return lines.join('\n');
}

export function match3FilterUniquePositions(positions) {
    const result = []
    const register = []

    for (const position of positions) {
        const id = position.row + ':' + position.column

        if (!register.includes(id)) {
            register.push(id)
            result.push(position)
        }
    }

    return result
}

export function match3PositionToString(position) {
    return position.row + ':' + position.column;
}

export function match3StringToPosition(str) {
    const split = str.split(':');

    return {
		row: Number(split[0]),
		column: Number(split[1])
	};
}