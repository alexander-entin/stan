import { assocPath, path } from 'rambda'
import { createReactor, snapshot, subscribe, watch } from '../utils/stan'

export type Entity = {
	id: string,
}

export type EntityChanges<T extends Entity> = {
	[method in 'post' | 'patch' | 'del']?: {
		[id: string]: T,
	}
}
export function entityChanges<T extends Entity>(ops: any[][]): EntityChanges<T> {
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

export type Crud<T extends Entity> = {
	get(query: unknown),
	post(entity: T),
	patch(patch: Partial<T>),
	del({ id, ids }: { id?: string, ids?: [string] })
}
export type Config<T extends Entity> = {
	key: string,
	$stan: object,
	$sync: Config<T>,
	crud: Crud<T>,
}
export function sync<T extends Entity>({ $sync, ...config }: Config<T>) {
	watch(get => {
		if ($sync) {
			Object.assign(config, get($sync))
		}
		createReactor('crud', `${config.key}.onPull`, ({ error, data }) => {
			config.$stan = data
			$sync.pull = { status: error ? 'ERROR' : 'OK', error }
		})
		createReactor('crud', `${config.key}.onPush`, ({ error }) => {

			$sync.push = { status: error ? 'ERROR' : 'OK', error }
		})

	})
	subscribe(config.$stan, ops => {
		console.log(ops)
		const changes = entityChanges(ops)
		const tasks = Object.entries(changes).map(([type, map]) =>
			Object.entries(map).map(([id, body]) => {
				body.id = id
				return config.crud[type](body)
			})
		).flat()
		Promise.all(tasks)
		.then(() => snap = snapshot(config.$stan))
		.catch(() => config.$stan = snap)
	})
}