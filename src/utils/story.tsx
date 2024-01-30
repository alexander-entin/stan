import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import { FC, useMemo } from 'react'
import deepRenderer from 'react-test-renderer'
import ShallowRenderer from 'react-test-renderer/shallow'
import { deepmergeInto } from 'deepmerge-ts'
import { useLocalStorage } from 'react-use'
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import 'react18-json-view/src/dark.css'
import { JsonDiffComponent } from 'json-diff-react'
import { diff } from 'deep-object-diff'

import './story.css'
import { Event, $global, snapshot, dispatch, replay } from './stan'

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

function JsonDiff({ a, b }) {
	const [expanded, setExpanded] = useLocalStorage('JsonDiff.expanded', false)
	return (
		<div
			className="h-full"
			onClick={() => setExpanded(!expanded)}
		>
			<JsonDiffComponent
				jsonA={a}
				jsonB={b}
				jsonDiffOptions={{
					full: expanded,
					maxElisions: 2,
					renderElision: n => n > 1 ? `... (${n})` : '...',
				}}
			/>
		</div>
	)
}

const emptyArr = []
export function Story({ initial, events = emptyArr as Event[], children }) {
	const event = events[events.length - 1]
	const [tab, setTab] = useLocalStorage('story.tab', 'UI')
	const states = useMemo(() => replay(events, initial), [events, initial])
	let [prev, curr] = states.slice(-2)
	const tabs = {
		'Event': () => event && <JsonView src={event} />,
		'State': () => event ? <JsonDiff a={prev} b={curr} /> : <JsonView src={prev} />,
		'UI': () => children,
	}
	return <>
		{(tabs[tab!] ?? tabs.UI)()}
		<div className="tabs fixed bottom-0 mx-auto left-50% -translate-x-50% z-999">
			{Object.keys(tabs).map(name =>
				<a
					className={`tab tab-bordered ${name === tab && 'tab-active'}`}
					onClick={() => setTab(name)}
					key={name}
				>
					{name}
				</a>
			)}
		</div>
	</>
}

export function tell(story, Component: FC) {
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
export function test(story, { it })
export function test(story, component: FC, { it })
export function test(story, components: DeepShallow, { it })
export function test(story, ...rest) {
	const { it } = rest.pop()
	const components = rest[0]
	let { initial = {}, events } = normalize(story)
	deepmergeInto($global, initial)
	let snap = snapshot($global)
	let { deep, shallow } = components || {}
	if (!deep && !shallow && components) {
		deep = { '': components }
	}
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
