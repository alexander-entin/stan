import LocalStorage from "../drivers/localStorage"
import { createStan, useStan } from "../utils/stan"

type Point = {
	x: number,
	y: number,
}

const $circles = createStan('circles', {
	list: [] as Point[],
	size: 0,
	onAdd(x, y) {
		$circles.list[$circles.size++] = { x, y }
		$circles.list.length = $circles.size
	},
	onUndo() {
		if ($circles.size) {
			$circles.size--
		}
	},
	onRedo() {
		if ($circles.size < $circles.list.length) {
			$circles.size++
		}
	}
})

// LocalStorage.sync('circles', $circles)

export function Page() {
	const cs = useStan($circles)
	return <>
		<div className="absolute left-0 top-0">
			<button
				className="btn"
				disabled={!cs.size}
				onClick={cs.onUndo}
			>
				<span className="i-mdi-undo text-xl" />
			</button>
			<button
				className="btn"
				disabled={cs.size === cs.list.length}
				onClick={cs.onRedo}
			>
				<span className="i-mdi-redo text-xl" />
			</button>
		</div>
		<div
			className="h-100vh"
			onClick={e => cs.onAdd(e.clientX, e.clientY)}
		>
			{cs.list.slice(0, cs.size).map((c, i) =>
				<div
					className="h-4 w-4 rounded-full absolute -m-2 border-white border-solid border-2"
					style={{ top: c.y, left: c.x }}
					key={i}
				/>
			)}
		</div>
	</>
}