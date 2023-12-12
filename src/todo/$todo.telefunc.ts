import { deepmergeInto } from 'deepmerge-ts'

import { Todo, TodoFilter, filters } from './$todo'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const todos = {} as { [id: string]: Todo }

export async function get(query: TodoFilter) {
	console.log('get', query)
	await delay(1000)
	return Object.values(todos).filter(filters[query])
}

export async function post(todo: Todo) {
	console.log('post', todo)
	await delay(1000)
	todos[todo.id] = todo
}

export async function patch(patch: Partial<Todo>) {
	console.log('patch', patch)
	await delay(1000)
	deepmergeInto(todos[patch.id!], patch)
}

export async function del({ id }: { id: string }) {
	console.log('del', id)
	await delay(1000)
	delete todos[id]
}
