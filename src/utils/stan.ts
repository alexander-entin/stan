import { proxy, useSnapshot, subscribe, ref } from 'valtio'
import { subscribeKey, derive, watch, devtools } from 'valtio/utils'
import { nanoid } from 'nanoid'

export { subscribe, subscribeKey, ref, derive, watch }
export const useStan = useSnapshot

export function subscribePaths(proxy: object, paths: string, fn: ([[string]]) => void, ...rest): () => void
export function subscribePaths(proxy: object, paths: [string], fn: ([[string]]) => void, ...rest): () => void
export function subscribePaths(proxy: object, paths: [[string]], fn: ([[string]]) => void, ...rest): () => void
export function subscribePaths(proxy, paths, fn, ...rest) {
	if (typeof paths === 'string') paths = paths.split(',')
	paths = paths.map(x => typeof x === 'string' ? x.split('.') : x)
	return subscribe(proxy, ops => {
		ops = ops.filter(([_, path]) => paths.find(p => p.every((x, i) => path[i] === x)))
		ops.length && fn(ops)
	}, ...rest)
}

export const $global = proxy({})

export const $event = proxy({
	id: '',
	now: 0,
	type: '',
	payload: [] as any[],
})

type Reactor = (...payload: any[]) => void
const reactors = {} as { [type: string]: { [module: string]: Reactor } }

if (import.meta.env.DEV) {
	if (typeof window === 'object') {
		Object.assign(window, {
			$global,
		})
	}
	devtools($global, { name: '$global', enabled: true })
}

export function createReactor<F extends Reactor>(
	module: string, event: string, fn: F
) {
	let rs = reactors[event] ?? {}
	reactors[event] = rs
	let id = module ?? Object.keys(rs).length
	rs[id] = fn
	return dispatch(event) as F
}

export const dispatch = (type: string) => (...payload) => {
	$event.id = nanoid()
	$event.now = Date.now()
	$event.type = type
	$event.payload = payload
	Object.values(reactors[type]).forEach(f => {
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
