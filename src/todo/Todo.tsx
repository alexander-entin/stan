import { useStan } from '../utils/stan'
import { $todo } from './$todo'

export function Todo({ id }) {
	console.log('Todo.render', id)
	const { map, onToggle, onDelete } = useStan($todo)
	const todo = map[id]
	return (
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