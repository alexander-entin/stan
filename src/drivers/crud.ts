import { assocPath, path } from 'rambda'
import { $global, subscribe } from '../utils/stan'

export type Entity = {
	id: string,
}

export type Crud<T extends Entity> = {
	get(query: any),
	post(entity: T, query?: any),
	patch(patch: Partial<T>, query?: any),
	del({ id, ids }: { id?: string, ids?: [string] }, query?: any)
}

type Op = [op: string, path: string[], value: any, prev?: any]
type Changes = { [method: string]: { [id: string]: any } }
function detectChanges(ops: Op[]): Changes {
	return ops.reduce((changes, [op, path, value]) => {
		if (path.length === 1) {
			return assocPath(
				[op === 'set' ? 'post' : 'del', path[0]],
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

export function sync<T extends Entity>(
	{ stanPath, filterPath, crud }:
	{ stanPath: string, filterPath?: any, crud: Crud<T> }
) {
	subscribe(path(stanPath, $global) as object, ops => {
		console.log(ops)
		const changes = detectChanges(ops as Op[])
		Object.entries(changes).forEach(([type, map]) => {
			Object.entries(map).forEach(([id, body]) => {
				body.id = id
				crud[type](body)
			})
		})
	})
}