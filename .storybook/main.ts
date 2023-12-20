import type { StorybookConfig } from "@storybook/react-vite"
import type { Indexer } from '@storybook/types'
import fs from 'fs'

// const indexer: Indexer = {
// 	test: /fixtures\./,
// 	createIndex: async (fileName) => {
// 		const content = JSON.parse(fs.readFileSync(fileName, 'utf-8'))

// 		const stories = generateStoryIndexesFromJson(content)

// 		return stories.map(story => ({
// 			type: 'story',
// 			importPath: `virtual:fixtures--${fileName}--${story.componentName}`,
// 			exportName: story.name
// 		}))
// 	},
// }

const config: StorybookConfig = {
	stories: [
		"../src/**/*.mdx",
		"../src/**/*stories.@(js|jsx|mjs|ts|tsx)",
		// "../src/**/*fixtures.@(js|jsx|mjs|ts|tsx)",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-onboarding",
		"@storybook/addon-interactions",
	],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	docs: {
		autodocs: "tag",
	},
	// experimental_indexers: async (existingIndexers) => [...existingIndexers, indexer],
}

export default config
