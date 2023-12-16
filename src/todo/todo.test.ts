import { $todo } from './$todo'
import { test } from '../utils/test'

const cases = {
	'todo creation': {
		events: [
			['todo.onDraft', 'buy milk'],
			['todo.onAdd'],
		]
	}
}

test($todo, cases)