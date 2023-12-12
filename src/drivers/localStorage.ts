import { path, assocPath } from 'rambda'

import { subscribe, subscribePaths } from "../utils/stan"
import { deepmergeInto } from 'deepmerge-ts'

export type Config = {
	$stan: object,
	paths?: string | string[] | string[][],
}

export function sync(key: string, { $stan, paths }: Config) {
	if (typeof localStorage === 'undefined') return
	if (typeof paths === 'string') {
		paths = paths.split(',')
	}
	const val = localStorage[key]
	if (val) {
		deepmergeInto($stan, JSON.parse(val))
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