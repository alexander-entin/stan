import { tell, test } from '../../../stan/story'
import { Page } from '../+Page'

const story = [
	["todo.onPull", { "pqRxsRzfIvfPhyL1Ol7cb": { "id": "pqRxsRzfIvfPhyL1Ol7cb", "text": "read", "done": false }, "XONBkwGngyqr60paySNfs": { "id": "XONBkwGngyqr60paySNfs", "text": "buy milk", "done": false }, "yFtPqsesTs2Q6IcJS3-cG": { "id": "yFtPqsesTs2Q6IcJS3-cG", "text": "buy meat" } }],
	["todo.onToggle", "XONBkwGngyqr60paySNfs"],
	["todo.onFilter", "!done"],
	["todo.onDeleteDone"],
	["todo.onFilter", ""],
	["todo.onDelete", "yFtPqsesTs2Q6IcJS3-cG"],
]

export default tell(story, Page)

if (import.meta.vitest) {
	test(story, Page, import.meta.vitest)
}
