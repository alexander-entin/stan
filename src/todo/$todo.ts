import { createStan, $event } from '/src/utils/stan'

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

