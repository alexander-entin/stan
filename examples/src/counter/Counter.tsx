import { createStan, useStan, LocalStorage } from '@agentin/stan'
import { proxy, useSnapshot } from 'valtio'

// export const $counter = createStan('counter', {
// 	count: 0,
// 	increment() {
// 		$counter.count++
// 	},
// })

export const $counter = proxy({
	count: 0
})

LocalStorage.sync('counter', $counter)

export function Counter() {
	// const { count, increment } = useStan($counter)
	const { count } = useSnapshot($counter)

	return (
		<button
			className="btn"
			// onClick={increment}
		>
			Counter {count}
		</button>
	)
}
