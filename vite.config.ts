/// <reference types="vitest" />

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

const test = process.env.VITEST
const story = process.env.npm_lifecycle_event === 'storybook'
const sandbox = test || story
console.log({ test, story, sandbox })

export default defineConfig({
	plugins: [
		!sandbox && hattip(),
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
		!sandbox && ssr(),
		telefunc(),
	],
	resolve: {
		alias: {
			"/src": '/src',
		},
	},
})