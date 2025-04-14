class BoardGrid {
	rows
	columns
	types
	grid

	constructor(rows, columns, types) {
		this.rows = rows
		this.columns = columns
		this.types = types

		this._createGrid(rows, columns, types)
	}

	// вернёт [ [1, 2, 1, 3], [3, 2, 1, 1], ... ]
	// mb todo: нет гарантии, что будут match'и
	_createGrid(rows, columns, types) {
		const grid = []
		const excludeList = []

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				let type = this.match3GetRandomType(types)

				excludeList.length = 0

				if (!grid[r]) {
					grid[r] = []
				}

				// Есть ли совпадения на 3 клетки для типа type (проверяем 2 клетки назад по вертикали или горизонтали)
				// Если получается совпадение, то исключаем текущий type (чтобы не было совпадений сразу же при старте)
				while (this.matchPreviousTypes(grid, r, c, type)) {
					excludeList.push(type)
					
					type = this.match3GetRandomType(types, excludeList)
				}

				grid[r][c] = type
			}
		}

		this.grid = grid
	}

	match3GetRandomType(types, exclude) {
		let list = types
	
		if (exclude) {
			list = types
				.concat()
				.filter(type => !exclude.includes(type))
		}
	
		const index = Math.floor(Math.random() * list.length)
	
		return list[index]
	}

	// Есть ли совпадения на 3 клетки (проверяем 2 клетки назад по вертикали или горизонтали)
	matchPreviousTypes(grid, row, column, type) {
		let horizontalMatch = false
		let verticalMatch = false

		if (grid[row]) {
			const horizontal1 = grid[row][column - 1]
			const horizontal2 = grid[row][column - 2]

			horizontalMatch = type === horizontal1 && type === horizontal2
		}

		if (grid[row - 1] && grid[row - 2]) {
			const vertical1 = grid[row - 1][column]
			const vertical2 = grid[row - 2][column]

			verticalMatch = type === vertical1 && type === vertical2
		}

		return horizontalMatch || verticalMatch
	}

	set(row, column, type) {
		if (this.grid[row]) {
			this.grid[row][column] = type
		}
	}
	
	get(row, column) {
		if (this.grid[row]) {
			return this.grid[row][column]
		}
	}

	swap(cellA, cellB) {
		this.set(cellA.row, cellA.column, cellB.type)
		this.set(cellB.row, cellB.column, cellA.type)

		return this
	}

	clone() {
		const clone = Object.create(this)
		const gridClone = []

		for (const row of this.grid) {
			gridClone.push(row.slice())
		}

		clone.grid = gridClone

		return clone
	}

	forEach(fn) {
		const grid = this.grid

		for (let r = 0; r < grid.length; r++) {
			for (let c = 0; c < grid[r].length; c++) {
				fn(r, c, grid[r][c])
			}
		}
	}

	getMatches(filter, matchSize = 3) {
		const allMatches = [
			...this.getMatchesByOrientation(matchSize, 'horizontal'),
			...this.getMatchesByOrientation(matchSize, 'vertical')
		]
	
		if (!filter) {
			// Return all matches found if filter is not provided
			return allMatches
		}
	
		// List of matches that involves positions in the provided filter
		const filteredMatches = []
	
		for (const match of allMatches) {
			let valid = false
	
			for (const position of match) {
				// Compare each position of the match to see if includes one of the filter positions
				for (const filterPosition of filter) {
					const same = this.comparePositions(position, filterPosition)

					if (same) {
						valid = true
					}
				}
			}
	
			if (valid) {
				// If match is valid (contains one of the filter positions), append that to the filtered list
				filteredMatches.push(match)
			}
		}
	
		return filteredMatches
	}

	getMatchesByOrientation(matchSize, orientation) {
		const matches = [];
		const grid = this.grid
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

	hasEmptyPositions() {
		const grid = this.grid
		const rows = grid.length
		const columns = grid[0].length
	
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				if (!grid[r][c]) {
					return true
				}
			}
		}
	
		return false
	}

	comparePositions(a, b) {
		return a.row === b.row && a.column === b.column
	}
}

export default BoardGrid