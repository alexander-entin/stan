import { $global, $event, snapshot, subscribe } from '../utils/stan'

if (typeof window !== 'undefined') {
	setTimeout(() => {
		let initial
		let events = []
		window.record = () => {
			if (events.length) {
				console.log({
					initial,
					events,
				})
			}
			initial = snapshot($global)
		}
		record()
		subscribe($event, () => {
			events.push(snapshot($event))
		})
	}, 1)
}
