import { tell, test } from '/src/utils/story'
import { Page } from '../+Page'

const story = [
	['todo.onDraft', 'read "Out of the Tar Pit" by Ben Moseley and Peter Marks'],
	['todo.onAdd'],
	['todo.onDraft', 'buy milk'],
	['todo.onAdd'],
	['todo.onAdd'],
	['todo.onDraft', ' '],
	['todo.onAdd'],
	['todo.onDraft', 'b'],
	['todo.onDraft', 'bu'],
	['todo.onDraft', 'buy'],
	['todo.onDraft', 'buy '],
	['todo.onDraft', 'buy m'],
	['todo.onDraft', 'buy me'],
	['todo.onDraft', 'buy mea'],
	['todo.onDraft', 'buy meat'],
	['todo.onAdd'],
]

export default tell(story, Page)

if (import.meta.vitest) {
	test(story, Page, import.meta.vitest)
}
