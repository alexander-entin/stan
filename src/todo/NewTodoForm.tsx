import { useStan } from '../utils/stan'
import { $todo } from './$todo'

export function NewTodoForm() {
	console.log('NewTodoForm.render')
	const { draft, onDraft, onAdd } = useStan($todo)
	return (
		<form
			onSubmit={e => {
				e.preventDefault()
				onAdd()
			}}
		>
			<input
				type="text"
				placeholder="New Todo"
				value={draft}
				onInput={e => onDraft(e.currentTarget.value)}
			/>
			<button
				className="btn"
				type="submit"
				// disabled={!draft.trim()}
			>
				Create
			</button>
		</form>
	)
}