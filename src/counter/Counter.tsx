import { createStan, useStan } from '/src/utils/stan'
import * as LocalStorage from '/src/drivers/localStorage'

export const $counter = createStan('counter', {
	count: 0,
	increment() {
		$counter.count++
	},
})

LocalStorage.sync('counter', $counter)

export function Counter() {
	const { count, increment } = useStan($counter)

	return (
		<button
			className="btn"
			onClick={increment}
		>
			Counter {count}
		</button>
	)
}
