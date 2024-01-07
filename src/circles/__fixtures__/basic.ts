import { tell, test } from '/src/utils/story'
import { Page } from '../+Page'

const story = [
	["circles.onAdd", [190, 115]],
	["circles.onAdd", [283, 115]],
	["circles.onAdd", [362, 113]],
	["circles.onUndo"],
	["circles.onUndo"],
	["circles.onUndo"],
	["circles.onRedo"],
	["circles.onAdd", [190, 57]],
	["circles.onAdd", [190, 7]],
	["circles.onUndo"],
	["circles.onUndo"],
	["circles.onUndo"],
	["circles.onRedo"],
	["circles.onRedo"],
	["circles.onRedo"],
]

export default tell(story, Page)

if (import.meta.vitest) {
	test(story, Page, import.meta.vitest)
}
