// вернёт [ [1, 2, 1, 3], [3, 2, 1, 1], ... ]
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
    const horizontal1 = grid[position.row][position.column - 1]
    const horizontal2 = grid[position.row][position.column - 2]
    const horizontalMatch = type === horizontal1 && type === horizontal2

    // Check if previous vertical positions are forming a match
    const vertical1 = grid[position.row - 1][position.column]
    const vertical2 = grid[position.row - 2][position.column]
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