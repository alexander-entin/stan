import { proxy, subscribe, snapshot, useSnapshot, ref } from 'valtio'
import { subscribeKey, derive, watch, devtools } from 'valtio/utils'
import { nanoid } from 'nanoid'

export { subscribe, subscribeKey, snapshot, derive, watch, ref }
export const useStan = useSnapshot

export const $global = proxy({})
export const $event = proxy({
	id: '',
	now: 0,
	type: '',
	payload: [] as any[],
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
	now: number,
}
export const dispatch = ({ id, now, type }: Partial<EventMeta>) => (...payload: unknown[]) => {
	$event.id = id ?? nanoid()
	$event.now = now ?? Date.now()
	$event.type = type!
	$event.payload = payload
	Object.values(reactors[type!]).forEach(f => {
		console.warn(type, JSON.stringify(payload), { f })
		f(...payload)
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

if (import.meta.env.DEV) {
	if (typeof window === 'object') {
		Object.assign(window, {	$global, $event, subscribe, derive, watch })
		devtools($global, { name: '$global', enabled: true })
	}
}
