import { createStan, $event, derive } from '/src/utils/stan'
import * as LocalStorage from '/src/drivers/localStorage'
import * as Crud from '/src/drivers/crud'
import * as telefuncs from './$todo.telefunc'
import { Todo, TodoFilter, filters } from './helpers'

export let $todo = {
	map: {} as { [id: string]: Todo },
	draft: '',
	filter: '' as TodoFilter,
	get filtered() {
		return (
			Object.values($todo.map)
			.filter(filters[$todo.filter])
			.filter(x => x.text.startsWith($todo.draft))
		)
	},
	onDraft(text: string) {
		$todo.draft = text
	},
	onAdd() {
		const text = $todo.draft.trim()
		if (!text) return
		const id = $event.id
		$todo.map[id] = {
			id,
			text,
		}
		$todo.draft = ''
	},
	onToggle(id: string) {
		const todo = $todo.map[id]
		todo.done = !todo.done
	},
	onDelete(id: string) {
		delete $todo.map[id]
	},
	onFilter(filter: TodoFilter) {
		$todo.filter = filter
	},
	onDeleteDone() {
		Object.values($todo.map)
		.filter(x => x.done)
		.forEach(x => {
			delete $todo.map[x.id]
		})
	},
}
$todo = createStan('todo', $todo)

LocalStorage.sync('todo-ui', $todo, { paths: 'filter' })

LocalStorage.sync('todo', $todo.map)

// Crud.sync('todo', $todo.map, {
// 	crud: telefuncs,
// }, derive({
// 	query: get => get($todo).filter,
// }))

// Rest.sync('todo', $todo.map, {
// 	base: 'https://example.com/api/v1/',
// 	poll: 10e3,
// }, derive({
// 	query: get => get($todo).filter,
// }))

// PouchDB.sync('todo', $todo.map, {
// 	local: 'todo',
// 	// remote: 'https://example.com/db/todo',
// }, derive({
// 	filter: get => get($todo).filter,
// }))
