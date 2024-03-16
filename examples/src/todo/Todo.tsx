import { useStan } from '@agentin/stan'
import { $todo } from './$todo'

export function Todo({ id }) {
	const { map, onToggle, onDelete } = useStan($todo)
	const todo = map[id]
	// console.log('Todo.render', todo)
	return todo && (
		<li className={todo.done ? 'line-through' : ''}>
			<input
				type="checkbox"
				checked={!!todo.done}
				onChange={() => onToggle(id)}
			/>
			{todo.text}
			{' '}
			<button onClick={() => onDelete(id)}>
				☠
			</button>
		</li>
	)
}