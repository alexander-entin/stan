import { TodoList } from './TodoList'
import { NewTodoForm } from './NewTodoForm'
import { TodoToolbar } from './TodoToolbar'

export default function Page() {
	console.log('todo.render')
	return (<>
		<h1>To-do List</h1>
		<NewTodoForm />
		<TodoToolbar />
		<TodoList />
	</>)
}
