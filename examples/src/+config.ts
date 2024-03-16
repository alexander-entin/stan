import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

import Layout from './layouts/LayoutDefault'
import Head from './layouts/HeadDefault'
import logoUrl from './assets/logo.svg'

// Default config (can be overridden by pages)
export default {
	ssr: false,
	Layout,
	Head,
	// <title>
	title: 'Sandbox',
	// <meta name='description'>
	// <link rel='icon' href='${favicon}' />
	favicon: logoUrl,
	extends: vikeReact,
} satisfies Config
