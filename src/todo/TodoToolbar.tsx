import { useStan } from '../utils/stan'
import { $todo } from './$todo'

export function TodoToolbar() {
	// console.log('TodoToolbar.render')
	const { map, filter, onFilter, onDeleteDone } = useStan($todo)
	return <>
		<input
			type="checkbox"
			checked={filter === '!done'}
			onChange={() => onFilter(filter === '!done' ? '' : '!done')}
		/>
		Hide completed
		<button
			className='btn'
			onClick={() => onDeleteDone()}
			disabled={!Object.keys(map).some(k => map[k].done)}
		>
			Remove completed
		</button>
	</>
}

