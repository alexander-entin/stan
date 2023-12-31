import { deepmergeInto } from 'deepmerge-ts'

import { Todo, TodoFilter, filters } from './helpers'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const todos = {} as { [id: string]: Todo }

export async function get(query: TodoFilter) {
	await delay(1000)
	return Object.values(todos).filter(filters[query])
}

export async function post(todo: Todo) {
	todos[todo.id] = todo
}

export async function patch(patch: Partial<Todo>) {
	await delay(1000)
	if (todos[patch.id!].text === 'impossible' && patch.done) {
		throw new Error(`Can't do that`)
	}
	deepmergeInto(todos[patch.id!], patch)
}

export async function del({ id }: { id: string }) {
	delete todos[id]
}
