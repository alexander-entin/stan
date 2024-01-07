import { TodoList } from './TodoList'
import { NewTodoForm } from './NewTodoForm'
import { TodoToolbar } from './TodoToolbar'
import { ClientOnly } from '../components/ClientOnly'

export function Page() {
	// console.log('/todo render')
	return <>
		<h1>To-do List</h1>
		<NewTodoForm />
		<ClientOnly>
			<TodoToolbar />
			<TodoList />
		</ClientOnly>
	</>
}
