export default {
	gameBoard: {
		rows: 6,
		columns: 4,
		elementSize: 70,
		mode: 'normal',
		elements: {
			apple: {
				id: 1 
			},
			cabbage: {
				id: 2
			},
			cheese1: {
				id: 3
			},
			cheese2: {
				id: 4
			}
		},
		modes: {
			normal: [ 'apple', 'cabbage', 'cheese1', 'cheese2' ]
		}
	}
}