import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
// import 'virtual:unocss-devtools'

// Default <head> (can be overridden by pages)
export default function HeadDefault() {
	return (
		<>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</>
	)
}
