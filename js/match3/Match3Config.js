export const match3ValidModes = ['test', 'easy', 'normal', 'hard'];

const blocks = {
    test: ['cell-garlic', 'cell-cheese1', 'cell-tomato'],
    easy: ['cell-garlic', 'cell-cheese1', 'cell-tomato', 'cell-apple'],
    normal: ['cell-garlic', 'cell-cheese1', 'cell-tomato', 'cell-apple', 'cell-cheese2'],
    hard: ['cell-garlic', 'cell-cheese1', 'cell-tomato', 'cell-apple', 'cell-cheese2', 'cell-cabbage'],
    special: []
    // special: ['special-blast', 'special-row', 'special-column', 'special-colour'],
};

const defaultConfig = {
    rows: 9,
    columns: 7,
    tileSize: 90,
    freeMoves: false,
    duration: 2000e3,
    mode: 'hard',
};

export function match3GetConfig(customConfig = {}) {
	return {
		...defaultConfig,
		...customConfig
	}
}

export function match3GetBlocks(mode) {
    return blocks[mode].concat(blocks.special)
}