import { proxy, subscribe, snapshot, useSnapshot, ref } from 'valtio'
import { subscribeKey, derive, watch, devtools } from 'valtio/utils'
import { nanoid } from 'nanoid'
import { path } from 'rambda'

export { subscribe, subscribeKey, snapshot, watch, derive, ref }
export const useStan = useSnapshot

export type Entity = {
	id: string,
	[key: string]: unknown,
}

export type SyncState = {
	status?: string,
	error?: unknown,
	pull: {
		[reqId: string]: {
			query: unknown,
			at: number,
			doneAt?: number,
			error?: unknown,
		},
	},
	push: {
		[reqId: string]: {
			method: string,
			body: Entity,
			prev: Entity,
			at: number,
			doneAt?: number,
			error?: unknown,
		},
	}
}

export const $global = proxy({
	sync: {} as Record<string, SyncState>,
})
export const $sync = $global.sync
export const $event = proxy({
	id: nanoid(),
	at: Date.now(),
	type: 'init',
	data: [] as any[],
})

type Reactor = (...payload: any[]) => void
const reactors = {} as { [event: string]: { [module: string]: Reactor } }
export function createReactor<F extends Reactor>(module: string, event: string, fn: F) {
	let rs = reactors[event] ?? {}
	reactors[event] = rs
	let id = module ?? Object.keys(rs).length
	rs[id] = fn
	return dispatch({ type: event }) as F
}

export type EventMeta = {
	type: string,
	id: string,
	at: number,
}
export type Event = EventMeta & { data?: any[] }

let initial
export const dispatch = ({ id, at, type }: Partial<EventMeta>) => (...payload: unknown[]) => {
	if (import.meta.env.DEV && typeof window === 'object') {
		initial ||= snapshot($global)
	}
	$event.id = id ?? nanoid()
	$event.at = at ?? Date.now()
	$event.type = type!
	$event.data = payload
	console.warn(type, JSON.stringify(payload))
	Object.values(reactors[type!]).forEach(f => {
		// console.warn(type, JSON.stringify(payload), { f })
		f(...payload)
	})
	// console.warn(snapshot($global))
}

function isVirtualProp(o, k) {
	let d = Object.getOwnPropertyDescriptor(o, k) || {}
	return d.get || d.set
}

function isDataProp(o, k) {
	return !isVirtualProp(o, k) && typeof o[k] !== 'function'
}

export function createStan<T extends object>(name: string, stan: T): T {
	Object.keys(stan).forEach(k => {
		if (!isVirtualProp(stan, k)
			&& typeof stan[k] === 'function'
			&& k.startsWith('on')
			&& k[2] === k[2]?.toUpperCase()
		) {
			let event = `${name}.${k}`
			stan[k] = createReactor(name, event, stan[k])
		}
	})
	$global[name] = stan
	return $global[name] as T
}

function dive(o, f, p = [] as string[]) {
	Object.keys(o).forEach(k => {
		if (!isDataProp(o, k)) return
		f(o, k, p)
		if (typeof o[k] === 'object') {
			dive(o[k], f, [...p, k])
		}
	})
}

export function reset($stan, snap = initial) {
	if (!snap) return
	dive(snap, (s, k, p) => {
		const $ = path(p, $stan)
		if (!isDataProp($, k)) return
		if (typeof s[k] !== 'object' || typeof $[k] !== 'object') {
			$[k] = structuredClone(s[k])
		}
	})
	dive($stan, ($, k, p) => {
		const s = path(p, snap)
		if (!(k in s)) {
			delete $[k]
		}
	})
}

export function integrated() {
	return import.meta.env.MODE !== 'test' && import.meta.env.MODE !== 'story'
}

export type Paths = string | string[] | string[][]
export type SubscribeCallback = (ops: unknown[][]) => void
export function subscribePaths(proxy: object, paths: Paths, fn: SubscribeCallback, ...rest) {
	if (typeof paths === 'string') paths = paths.split(',')
	paths = paths.map(x => typeof x === 'string' ? x.split('.') : x)
	return subscribe(proxy, ops => {
		ops = ops.filter(([_, path]) =>
			(paths as string[][]).find(p => p.every((x, i) => path[i] === x))
		)
		ops.length && fn(ops)
	}, ...rest)
}

if (import.meta.env.DEV && typeof window === 'object') {
	Object.assign(window, { $global, $event, proxy, subscribe, watch, derive, snapshot, reset })
	devtools($global, { name: '$global', enabled: true })

	let snap
	let events = [] as Event[]
	function story() {
		const indent = snap ? '\t' : ''
		let json = ['[', ...events.map(({ type, data = [] }) => {
			let rest = [data]
			if (data.length === 0) {
				rest = []
			} else if (data.length === 1 && !Array.isArray(data[0])) {
				rest = data
			}
			return `\t${JSON.stringify([type, ...rest])},`
		}), ']'].join(`\n${indent}`)
		if (snap) {
			let init = JSON.stringify(snap, null, '\t')
			init = init.split('\n').map((r, i) => `${i ? '\t' : ''}${r}`).join('\n')
			json = `{\n\tinitial: ${init},\n\tevents: ${json}\n}`
		}
		const val = snap ? { initial: snap, events } : events
		events = []
		snap = snapshot($global)
		dive(snap, (s, k, p) => {
			const $ = path(p, $global)
			if (!isDataProp($, k)) {
				delete s[k]
			}
		})
		console.log(json)
		return val
	}
	subscribe($event, () => {
		events.push(snapshot($event) as Event)
	})
	window['story'] = story
}
