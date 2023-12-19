import { deepmergeInto } from 'deepmerge-ts'

import { $global, dispatch } from '/src/utils/stan'
import Page from './+Page'
import { NewTodoForm } from './NewTodoForm'
import { TodoToolbar } from './TodoToolbar'
import { TodoList } from './TodoList'
import { useEffect } from 'react'

const cases = {
	'todo creation': {
		events: [
			{ type: 'todo.onDraft', data: 'buy milk' },
			{ type: 'todo.onAdd' },
		]
	}
}

export function Stan({ initial, events, children }) {
	useEffect(() => {
		// deepmergeInto($global, initial)
		let t = new Date('2020-02-02').valueOf()
		events.forEach(event => {
			const { id = `#${t}`, at = t, type, data } = event
			dispatch({ id, at, type })(...(Array.isArray(data) ? data : [data]))
		})
	}, [initial, events])
	return children
}

export function stories(cases, defaultComponents) {
	Object.entries(cases).forEach(([suit, { events, components }]) => {
		components = components || defaultComponents
		// const cs = typeof components === 'function' ? components(event, idx) : components
		Object.entries(components).forEach(([component, Component]) => {
			const stories = storiesOf(`${component}/${suit}`)
			events.forEach(({ type }, idx) => {
				stories.add(`$${idx}. ${type}`, () => (
					<Stan
						events={events.slice(0, idx + 1)}
					>
						<Component />
					</Stan>
				))
			})
		})
	})
}

stories(cases, { Page, NewTodoForm, TodoToolbar, TodoList })
