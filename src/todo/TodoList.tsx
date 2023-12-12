import { useStan } from '../utils/stan'
import { $todo } from './$todo'
import { Todo } from './Todo'

export function TodoList() {
	const { filtered } = useStan($todo)
	console.log('TodoList.render', filtered)
	return (
		<ul>
			{filtered.map(x => (
				<Todo id={x.id} key={x.id} />
			))}
		</ul>
	)
}
