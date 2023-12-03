import { createStan, $event } from '/src/utils/stan'
import * as Crud from '/src/drivers/crud'
import * as LocalStorage from '/src/drivers/localStorage'
import * as telefuncs from './$todo.telefunc'

export type Todo = {
	id: string,
	text: string,
	done?: boolean,
	createdAt: number,
	changedAt?: number,
}

export const filters = {
	'': x => true,
	'!done': x => !x.done,
}

export type TodoFilter = keyof typeof filters

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
			createdAt: $event.now,
		}
		$todo.draft = ''
	},
	onToggle(id: string) {
		const todo = $todo.map[id]
		todo.done = !todo.done
		todo.changedAt = $event.now
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

Crud.sync({
	stanPath: 'todo.map',
	filterPath: 'todo.filter',
	crud: telefuncs,
})

LocalStorage.sync({
	stanPath: 'todo',
	filter: 'filter',
})