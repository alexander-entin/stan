import type { Preview } from "@storybook/react"
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
}
export default preview