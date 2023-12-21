import { proxy, subscribe, snapshot, useSnapshot, ref } from 'valtio'
import { subscribeKey, derive, watch, devtools } from 'valtio/utils'
import { nanoid } from 'nanoid'

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
	initial ||= snapshot($global)
	$event.id = id ?? nanoid()
	$event.at = at ?? Date.now()
	$event.type = type!
	$event.data = payload
	console.warn(type, JSON.stringify(payload))
	Object.values(reactors[type!]).forEach(f => {
		// console.warn(type, JSON.stringify(payload), { f })
		f(...payload)
	})
}

export function reset(init = initial) {
	if (!init) return
	Object.entries($global).forEach(([stanK, stan]) => {
		Object.keys(stan).forEach(k => {
			let d = Object.getOwnPropertyDescriptor(stan, k) || {}
			let virtual = d.get || d.set
			if (virtual || typeof stan[k] === 'function') return
			delete stan[k]
			if (k in init[stanK]) {
				stan[k] = structuredClone(init[stanK][k])
			}
		})
	})
}

export function createStan<T extends object>(name: string, stan: T): T {
	Object.keys(stan).forEach(k => {
		let d = Object.getOwnPropertyDescriptor(stan, k) || {}
		let virtual = d.get || d.set
		if (!virtual
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

export function integrated() {
	return import.meta.env.MODE !== 'test' && import.meta.env.MODE !== 'story'
}

if (import.meta.env.DEV) {
	if (typeof window === 'object') {
		Object.assign(window, { $global, $event, proxy, subscribe, watch, derive, snapshot, reset })
		devtools($global, { name: '$global', enabled: true })
		setTimeout(() => {
			let initial
			let events = [] as Event[]
			function story() {
				console.log({ initial, events })
				initial = snapshot($global)
				events = []
			}
			subscribe($event, () => {
				events.push(snapshot($event) as Event)
			})
			window['story'] = story
		}, 1)
	}
}
