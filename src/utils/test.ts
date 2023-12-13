import { it } from 'vitest'

import { dispatch, $global, snapshot } from '../utils/stan'

export function test($stan, cases) {
	Object.entries(cases).forEach(([name, spec]) => {
		it(name, ({ expect }) => {
			spec.events.forEach(({ data, ...meta }) =>
				dispatch(meta)(...(Array.isArray(data) ? data : [data]))
			)
			const snap = snapshot($global)
			expect(snap).toMatchSnapshot()
		})
	})
}