import { ReactNode } from 'react'
import { Link } from '../components/Link'

import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'

export default function LayoutDefault({	children }: { children: ReactNode }) {
	const linkProps = {
		className: "p-x-10 p-y-2 -m-l-10",
		activeClassName: "bg-gray-500",
	}
	return (
		<div flex>
			<div flex flex-col shrink-0 p-20 leading-7 border-r-2 border-gray-500>
				<Link {...linkProps} href="/">Welcome</Link>
				<Link {...linkProps} href="/todo">Todo (telefunc)</Link>
				<Link {...linkProps} href="/star-wars">Data Fetching</Link>
			</div>
			<div p-20 pb-50 min-h-100vh>
				{children}
			</div>
		</div>
	)
}

//>