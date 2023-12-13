import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { hattip } from "@hattip/vite"
import ssr from "vike/plugin"
import { telefunc } from "telefunc/vite"
import unocss from 'unocss/vite'
import { presetUno, transformerDirectives, presetAttributify } from 'unocss'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'
import { presetFluid } from 'unocss-preset-fluid'
import { presetDaisy } from 'unocss-preset-daisy'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
	plugins: [
//		hattip(),
		unocss({
			transformers: [
				transformerAttributifyJsx(),
				transformerDirectives(),
			],
			presets: [
				presetAttributify(),
				presetUno(),
				presetFluid(),
				presetDaisy(),
				presetIcons({
					prefix: 'i-',
					extraProperties: {
						display: 'inline-block'
					}
				}),
			],
		}),
		react(),
		ssr(),
		telefunc(),
	],
	resolve: {
		alias: {
			"/src": '/src',
		},
	},
})