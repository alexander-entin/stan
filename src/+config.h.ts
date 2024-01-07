import type { Config } from 'vike/types'
import vikeReact from 'vike-react'

import Layout from './layouts/LayoutDefault'
import Head from './layouts/HeadDefault'
import logoUrl from './assets/logo.svg'

// Default config (can be overridden by pages)
export default {
	// Layout,
	Head,
	// <title>
	title: 'Sandbox',
	// <meta name='description'>
	description: 'Playground',
	// <link rel='icon' href='${favicon}' />
	favicon: logoUrl,
	extends: vikeReact,
} satisfies Config
