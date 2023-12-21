import { path, assocPath } from 'rambda'

import { createReactor, dispatch, integrated, subscribe, subscribePaths } from "../utils/stan"
import { deepmergeInto } from 'deepmerge-ts'

export type Config = {
	paths?: string | string[] | string[][],
	async?: boolean,
}

export function sync(key: string, $stan: object, { paths, async }: Config = {}) {
	if (!integrated()) return
	if (typeof localStorage === 'undefined') return
	if (typeof paths === 'string') {
		paths = paths.split(',')
	}
	const json = localStorage[key]
	if (json) {
		const val = JSON.parse(json)
		if (async) {
			setTimeout(() => dispatch({ type: `${key}.onPull` })(val), 1)
			createReactor('crud', `${key}.onPull`, val => {
				deepmergeInto($stan, val)
			})
		} else {
			deepmergeInto($stan, val)
		}
	}
	if (paths) {
		subscribePaths($stan, paths, () => {
			const val = (paths as string[] | string[][]).reduce((v, p) => (
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