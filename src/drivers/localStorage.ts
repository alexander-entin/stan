import { path, assocPath } from 'rambda'
import { deepmergeInto } from 'deepmerge-ts'

import { createReactor, dispatch, integrated, subscribe, subscribePaths } from ".."

export type Config = {
	paths?: string | string[] | string[][],
	sync?: boolean,
}

export function sync(key: string, $stan: object, { paths, sync }: Config = {}) {
	if (!sync) {
		createReactor('crud', `${key}.onPull`, val => {
			deepmergeInto($stan, val)
		})
	}
	if (!integrated()) return
	if (typeof localStorage === 'undefined') return
	if (typeof paths === 'string') {
		paths = paths.split(',')
	}
	const json = localStorage[key]
	if (json) {
		const val = JSON.parse(json)
		if (sync) {
			deepmergeInto($stan, val)
		} else {
			setTimeout(() => dispatch({ type: `${key}.onPull` })(val), 1)
		}
	}
	if (paths) {
		subscribePaths($stan, paths, () => {
			const val = paths!.reduce((v, p) => (
				assocPath(p, path(p as any, $stan), v)
			), {})
			localStorage[key] = JSON.stringify(val)
		})
	} else {
		subscribe($stan, () => {
			localStorage[key] = JSON.stringify($stan)
		})
	}
}

const LocalStorage = { sync }
export default LocalStorage