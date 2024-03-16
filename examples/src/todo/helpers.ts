export type Todo = {
	id: string,
	text: string,
	done?: boolean,
}

export const filters = {
	'': x => true,
	'!done': x => !x.done,
}

export type TodoFilter = keyof typeof filters
