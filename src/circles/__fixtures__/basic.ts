import { tell, test } from '/src/utils/story'
import { Page } from '../+Page'

const story = [
	["circles.onAdd", [27, 51]],
	["circles.onAdd", [42, 57]],
	["circles.onAdd", [55, 61]],
	["circles.onAdd", [67, 66]],
	["circles.onAdd", [82, 71]],
	["circles.onUndo"],
	["circles.onUndo"],
	["circles.onAdd", [96, 75]],
	["circles.onUndo"],
	["circles.onUndo"],
	["circles.onRedo"],
	["circles.onRedo"],
]

export default tell(story, Page)

if (import.meta.vitest) {
	test(story, Page, import.meta.vitest)
}
