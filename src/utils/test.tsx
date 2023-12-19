import { describe, it } from 'vitest'
import { diff } from 'deep-object-diff'
import deepRenderer from 'react-test-renderer'
import ShallowRenderer from 'react-test-renderer/shallow'

import { dispatch, $global, snapshot } from './stan'

export function test(cases, defaultComponents) {
	Object.entries(cases).forEach(([name, { events, components }]) => {
		components = components || defaultComponents
		describe(name, () => {
			let t = new Date('2020-02-02').valueOf()
			let snap = snapshot($global)
			events.forEach((event, idx) => {
				const { id = `#${t}`, at = t, type, data } = event
				dispatch({ id, at, type })(...(Array.isArray(data) ? data : [data]))
				const curr = snapshot($global)
				const d = diff(snap, curr)
				delete d.event
				snap = curr
				it(`${idx}. ${type} > $stan changes`, ({ expect }) => {
					expect(d).toMatchSnapshot()
				})
				const cs = typeof components === 'function' ? components(event, idx) : components
				if (cs) {
					Object.entries(cs).forEach(([name, Component]) => {
						const component = <Component />
						const shallowRenderer = new ShallowRenderer()
						const shallow = shallowRenderer.render(component)
						it(`${idx}. ${type} > ${name} (shallow)`, ({ expect }) => {
							expect(shallow).toMatchSnapshot()
						})
						const deep = deepRenderer.create(component).toJSON()
						it(`${idx}. ${type} > ${name} (deep)`, ({ expect }) => {
							expect(deep).toMatchSnapshot()
						})
					})
				}
				t++
			})
		})
	})
}