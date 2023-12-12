import { createStan, $event, derive } from '/src/utils/stan'
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
	sync: {
		config: {
			query: '' as TodoFilter,
		},
		state: {},
	},
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
			createdAt: $event.at,
		}
		$todo.draft = ''
	},
	onToggle(id: string) {
		const todo = $todo.map[id]
		todo.done = !todo.done
		todo.changedAt = $event.at
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

$todo.sync.config = derive({
	query: get => get($todo).filter,
})

Crud.sync('todo', {
	$stan: $todo.map,
	crud: telefuncs,
	$state: $todo.sync.state,
	$config: $todo.sync.config,
})

LocalStorage.sync('todo-ui', {
	$stan: $todo,
	paths: 'filter',
})
