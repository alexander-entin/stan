import { test } from '../utils/test'
import Page from './+Page'
import { NewTodoForm } from './NewTodoForm'
import { TodoToolbar } from './TodoToolbar'
import { TodoList } from './TodoList'

const cases = {
	'todo creation': {
		events: [
			{ type: 'todo.onDraft', data: 'buy milk' },
			{ type: 'todo.onAdd' },
		]
	}
}

test(cases, { Page, NewTodoForm, TodoToolbar, TodoList })