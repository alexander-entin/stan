import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import { FC, useEffect } from 'react'
import { diff } from 'deep-object-diff'
import deepRenderer from 'react-test-renderer'
import ShallowRenderer from 'react-test-renderer/shallow'
import { deepmergeInto } from 'deepmerge-ts'

import { Event, $global, snapshot, dispatch, reset } from './stan'

export function normalize(story) {
	if (Array.isArray(story)) {
		story = { events: story }
	}
	let t = new Date('2020-02-02').valueOf()
	story.events = story.events?.map(event => {
		let id, at, type, data
		if (Array.isArray(event)) {
			[type, data] = event
		} else {
			({ id, at, type, data } = event)
		}
		id ||= `#${t}`
		at ||= t++
		data = Array.isArray(data) ? data : data === undefined ? [] : [data]
		return { id, at, type, data }
	}) || []
	return story
}

export function Story({ initial, events = [] as Event[], children }) {
	useEffect(() => {
		reset($global, initial)
		events.forEach(event => {
			const { data, ...meta } = event
			dispatch(meta)(...structuredClone(data)!)
		})
	}, [events])
	return children
}

export function tell(Component: FC, story) {
	const { initial, events } = normalize(story)
	const fs = {
		'0. initial': <Story initial={initial}><Component /></Story>
	}
	events.forEach(({ type }, idx) => {
		fs[`${idx + 1}. ${type}`] = (
			<Story initial={initial} events={events.slice(0, idx + 1)}>
				<Component />
			</Story>
		)
	})
	return fs
}

export type DeepShallow = { [method in 'deep' | 'shallow']?: Record<string, FC> }
export function test(story, components: DeepShallow, { it }) {
	let { initial = {}, events } = normalize(story)
	deepmergeInto($global, initial)
	let snap = snapshot($global)
	let { deep, shallow } = components ?? {}
	events.forEach((event, idx) => {
		const { id, at, type, data } = event
		dispatch({ id, at, type })(...(Array.isArray(data) ? data : [data]))
		const curr = snapshot($global)
		const d = diff(snap, curr)
		snap = curr
		const prefix = `${idx + 1}. ${type} >`
		it(`${prefix} $stan changes`, ({ expect }) => {
			expect(d).toMatchSnapshot()
		})
		Object.entries(shallow ?? {}).forEach(([name, Component]) => {
			const shallowRenderer = new ShallowRenderer()
			const shallow = shallowRenderer.render(<Component />)
			it(`${prefix} ${name} (shallow)`, ({ expect }) => {
				expect(shallow).toMatchSnapshot()
			})
		})
		Object.entries(deep ?? {}).forEach(([name, Component]) => {
			const deep = deepRenderer.create(<Component />).toJSON()
			it(`${prefix} ${name} (deep)`, ({ expect }) => {
				expect(deep).toMatchSnapshot()
			})
		})
	})
}
