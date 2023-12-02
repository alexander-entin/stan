import { createStan, useStan } from '/src/utils/stan'

export const $counter = createStan({
	count: 0,
	increment() {
		$counter.count++
	},
})

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

//>