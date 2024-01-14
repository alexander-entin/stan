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
const story = process.env.npm_lifecycle_event === 'storybook' || process.env.npm_lifecycle_event === 'cosmos'
const integrated = !test && !story

export default defineConfig(({ mode }) => ({
	mode: test ? 'test' : story ? 'story' : mode,
	plugins: [
		integrated && hattip(),
		unocss({
			transformers: [
				transformerAttributifyJsx(),
				transformerDirectives(),
			],
			presets: [
				presetAttributify(),
				presetUno(),
				presetFluid(),
				presetDaisy({
					themes: ["business"],
				}),
				presetIcons({
					warn: true,
					cdn: 'https://esm.sh/',
					extraProperties: {
						display: 'inline-block'
					}
				}),
			],
		}),
		react(),
		integrated && ssr(),
		telefunc(),
	],
	resolve: {
		alias: {
			"/src": '/src',
		},
	},
	define: {
		'import.meta.vitest': 'undefined',
	},
	test: {
		includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
	},
}))