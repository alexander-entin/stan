import { mergeDeep } from 'unocss'

import { Todo, TodoFilter, filters } from './$todo'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const todos = {} as { [id: string]: Todo }

export async function get(filter: TodoFilter) {
	await delay(1000)
	return Object.values(todos).filter(filters[filter])
}

export async function post(todo: Todo) {
	todos[todo.id] = todo
}

export async function patch(patch: Partial<Todo>) {
	const { id = '' } = patch
	todos[id] = mergeDeep(todos[id], patch)
}

export async function del({ id }: { id: string }) {
	delete todos[id]
}
