// вернёт [ [1, 2, 1, 3], [3, 2, 1, 1], ... ]
// mb todo: нет гарантии, что будут match'и
export function match3CreateGrid(rows = 6, columns = 6, types) {
    const grid = []

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let type = match3GetRandomType(types)

            const excludeList = []

            if (!grid[r]) {
				grid[r] = []
			}

			// Есть ли совпадения на 3 клетки для типа type (проверяем 2 клетки назад по вертикали или горизонтали)
			// Если получается совпадение, то исключаем текущий type (чтобы не было совпадений сразу же при старте)
            while (matchPreviousTypes(grid, { row: r, column: c }, type)) {
                excludeList.push(type)
				
                type = match3GetRandomType(types, excludeList)
            }

            grid[r][c] = type
        }
    }

    return grid
}

export function match3CloneGrid(grid) {
    const clone = [];
    for (const row of grid) {
        clone.push(row.slice());
    }
    return clone;
}

export function match3GetRandomType(types, exclude) {
    let list = types.concat()

    if (exclude) {
        list = types.filter((type) => !exclude.includes(type))
    }

    const index = Math.floor(Math.random() * list.length)

    return list[index]
}

// Есть ли совпадения на 3 клетки (проверяем 2 клетки назад по вертикали или горизонтали)
function matchPreviousTypes(grid, position, type) {
    // Check if previous horizontal positions are forming a match
    const horizontal1 = grid[position.row]?.[position.column - 1]
    const horizontal2 = grid[position.row]?.[position.column - 2]
    const horizontalMatch = type === horizontal1 && type === horizontal2

	// todo: refactor - заменить ?.
    // Check if previous vertical positions are forming a match
    const vertical1 = grid[position.row - 1]?.[position.column]
    const vertical2 = grid[position.row - 2]?.[position.column]
    const verticalMatch = type === vertical1 && type === vertical2

    // Return if either horizontal or vertical psoitions are forming a match
    return horizontalMatch || verticalMatch
}

export function match3ForEach(grid, fn) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            fn({ row: r, column: c }, grid[r][c]);
        }
    }
}

export function match3SetPieceType(grid, position, type) {
    grid[position.row][position.column] = type
}

export function match3GetPieceType(grid, position) {
    return grid?.[position.row]?.[position.column]
}

export function match3SwapPieces(grid, positionA, positionB) {
    const typeA = match3GetPieceType(grid, positionA)
    const typeB = match3GetPieceType(grid, positionB)

    // Only swap pieces if both types are valid (not undefined)
    if (typeA !== undefined && typeB !== undefined) {
        match3SetPieceType(grid, positionA, typeB)
        match3SetPieceType(grid, positionB, typeA)
    }
}

function match3GetMatchesByOrientation(grid, matchSize, orientation) {
    const matches = [];
    const rows = grid.length;
    const columns = grid[0].length;
    let lastType = undefined;
    let currentMatch = [];

    // Define primary and secondary orientations for the loop
    const primary = orientation === 'horizontal' ? rows : columns;
    const secondary = orientation === 'horizontal' ? columns : rows;

    for (let p = 0; p < primary; p++) {
        for (let s = 0; s < secondary; s++) {
            // On horizontal 'p' is row and 's' is column, vertical is opposite
            const row = orientation === 'horizontal' ? p : s;
            const column = orientation === 'horizontal' ? s : p;
            const type = grid[row][column];

			// Составляем ряд одинаковых элементов (сколько угодно)
            if (type && type === lastType) {
                // Type is the same as the last type, append to the match list
                currentMatch.push({ row, column });
            } else {
                // Если ряд из 3 и более элементов - это match
                if (currentMatch.length >= matchSize) {
                    matches.push(currentMatch);
                }
                // Start a new match
                currentMatch = [{ row, column }];
                // Save last type to check in the next pass
                lastType = type;
            }
        }

        // Row (or column) finished. Append current match if suitable
        if (currentMatch.length >= matchSize) {
            matches.push(currentMatch);
        }

        // Cleanup before mmoving to the next row (or column)
        lastType = undefined;
        currentMatch = [];
    }

    return matches;
}

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

export function match3GetMatches(grid, filter, matchSize = 3) {
    const allMatches = [
        ...match3GetMatchesByOrientation(grid, matchSize, 'horizontal'),
        ...match3GetMatchesByOrientation(grid, matchSize, 'vertical')
    ]

    if (!filter) {
        // Return all matches found if filter is not provided
        return allMatches;
    }

    // List of matches that involves positions in the provided filter
    const filteredMatches = [];

    for (const match of allMatches) {
        let valid = false

        for (const position of match) {
            // Compare each position of the match to see if includes one of the filter positions
            for (const filterPosition of filter) {
                const same = match3ComparePositions(position, filterPosition);
                if (same) valid = true;
            }
        }

        if (valid) {
            // If match is valid (contains one of the filter positions), append that to the filtered list
            filteredMatches.push(match);
        }
    }

    return filteredMatches;
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

export function match3GetEmptyPositions(grid) {
    const positions = [];
    const rows = grid.length;
    const columns = grid[0].length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (!grid[r][c]) {
                positions.push({ row: r, column: c });
            }
        }
    }

    return positions;
}

export function match3GridToString(grid) {
    const lines = [];

    for (const row of grid) {
        const list = row.map((type) => String(type).padStart(2, '0'));
        lines.push('|' + list.join('|') + '|');
    }

    return lines.join('\n');
}

export function match3FillUp(grid, types) {
	// Создаём временный grid с рандомным заполнением
	// И для оригинальной grid заполняем пустые ячейки
	// mb todo: здесь нет гарантии, что при заполнении будут match'и
    const tempGrid = match3CreateGrid(grid.length, grid[0].length, types)

    const rows = grid.length
    const columns = grid[0].length
    const newPositions = []

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (!grid[r][c]) {
                grid[r][c] = tempGrid[r][c]
                newPositions.push({ row: r, column: c })
            }
        }
    }

    return newPositions.reverse()
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