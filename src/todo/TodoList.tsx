import { useStan } from '../utils/stan'
import { $todo } from './$todo'
import { Todo } from './Todo'

export function TodoList() {
	console.log('TodoList.render')
	const { filtered } = useStan($todo)
	return (
		<ul>
			{filtered.map(x => (
				<Todo id={x.id} key={x.id} />
			))}
		</ul>
	)
}
