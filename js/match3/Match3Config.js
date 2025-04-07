export const match3ValidModes = ['test', 'easy', 'normal', 'hard'];

const blocks = {
    test: ['piece-dragon', 'piece-frog', 'piece-newt'],
    easy: ['piece-dragon', 'piece-frog', 'piece-newt', 'piece-snake'],
    normal: ['piece-dragon', 'piece-frog', 'piece-newt', 'piece-snake', 'piece-spider'],
    hard: ['piece-dragon', 'piece-frog', 'piece-newt', 'piece-snake', 'piece-spider', 'piece-yeti'],
    special: ['special-blast', 'special-row', 'special-column', 'special-colour'],
};

const defaultConfig = {
    rows: 9,
    columns: 7,
    tileSize: 50,
    freeMoves: false,
    duration: 60,
    mode: 'normal',
};

export function match3GetConfig(customConfig = {}) {
	return {
		...defaultConfig,
		...customConfig
	}
}