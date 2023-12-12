import { assocPath, indexBy } from 'rambda'
import { Entity, $sync, $event, createReactor, dispatch, snapshot, subscribe, watch } from '../utils/stan'

export type Mutation = 'post' | 'patch' | 'del'

export type EntityChanges = {
	[method in Mutation]?: {
		[id: string]: Entity,
	}
}
export function entityChanges(ops: any[][]): EntityChanges {
	return ops.reduce((changes, [op, path, value]) => {
		if (path.length === 1) {
			return assocPath(
				[op === 'set' ? 'post' : 'del', String(path[0])],
				value,
				changes,
			)
		} else {
			return assocPath(
				['patch', ...path],
				op === 'set' ? value : undefined,
				changes,
			)
		}
	}, {})
}

export type Crud = {
	get(query: unknown),
	post(entity: Entity),
	patch(patch: Entity),
	del({ id, ids }: { id?: string, ids?: [string] })
}
export type Config = {
	enabled?: boolean,
	crud: Crud,
	query?: unknown,
}
function cleanupEffects(map: Record<string, any>, at: number) {
	Object.entries(map).forEach(([id, { doneAt }]) => {
		if (doneAt < at) delete map[id]
	})
}
export function sync(key: string, $stan: object, config: Config, $config: Partial<Config>) {
	$sync[key] = $sync[key] ?? { pull: {}, push: {} }
	const $state = $sync[key]
	watch(get => {
		Object.assign(config, get($config))
		const { enabled = true, crud, query } = config
		$state.status = 'ok'
		cleanupEffects($state.pull, $event.at - 60e3)
		if (enabled) {
			$state.status = 'active'
			const reqId = `get ?${query} @${$event.at}`
			$state.pull[reqId] = {
				query,
				at: $event.at,
			}
			crud.get(query)
			.then(data => dispatch({ type: `${key}.onPull` })({ reqId, data }))
			.catch(error => dispatch({ type: `${key}.onPull` })({ reqId, error }))
		}
	})
	let prev = snapshot($stan)
	createReactor('crud', `${key}.onPull`, ({ reqId, data, error }) => {
		const req = $state.pull![reqId]
		req.error = error
		req.doneAt = $event.at
		const reqIds = Object.keys($state.pull!)
		if (reqId === reqIds[reqIds.length - 1]) {
			if (error) {
				$state.status = 'error'
				$state.error = error
			} else {
				$state.status = 'ok'
				delete $state.error
				Object.keys($stan).forEach(id => delete $stan[id])
				Object.assign($stan, indexBy('id', data))
				prev = snapshot($stan)
			}
		}
	})
	subscribe($stan, ops => {
		if (snapshot($stan) === prev) return
		const changes = entityChanges(ops)
		cleanupEffects($state.push!, $event.at - 60e3)
		Object.entries(changes).forEach(([method, map]) =>
			Object.entries(map).forEach(([id, body]) => {
				body.id = id
				const reqId = `${method} #${id} @${$event.at}`
				$state.push![reqId] = {
					method,
					body,
					prev: prev[id],
					at: $event.at,
				}
				config.crud[method](body)
				.then(data => dispatch({ type: `${key}.onPush` })({ reqId, data }))
				.catch(error => dispatch({ type: `${key}.onPush` })({ reqId, error }))
			})
		)
		prev = snapshot($stan)
	})
	createReactor('crud', `${key}.onPush`, ({ reqId, data, error }) => {
		const req = $state.push![reqId]
		req.error = error
		req.doneAt = $event.at
		if (error) {
			$state.status = 'error'
			$state.error = error
			if (req.method === 'post') {
				delete $stan[req.body.id]
			} else {
				$stan[req.body.id] = req.prev
			}
			prev = snapshot($stan)
		} else {
			$state.status = 'ok'
			delete $state.error
		}
	})
}