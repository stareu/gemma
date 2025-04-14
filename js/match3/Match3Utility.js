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