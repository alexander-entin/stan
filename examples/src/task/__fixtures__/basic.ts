import { tell, test } from '../../../stan/story'
import { Page } from '../+Page'

const story = [
]

export default tell(story, Page)

if (import.meta.vitest) {
	test(story, Page, import.meta.vitest)
}
