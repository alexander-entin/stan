import { ReactNode } from 'react'

import { Link } from '../components/Link'

const menu = {
	'/': 'Welcome',
	'/todo': 'Todo',
}

export default function LayoutDefault({	children }: { children: ReactNode }) {
	return (
		<div flex>
			<div flex flex-col shrink-0 p-20 leading-7 border-r-2 border-gray-500>
				{Object.entries(menu).map(([href, title]) =>
					<Link
						className="p-x-10 p-y-2 -m-l-10"
						activeClassName="bg-gray-500"
						href={href}
						key={href}
					>
						{title}
					</Link>
				)}
			</div>
			<div p-20 pb-50 min-h-100vh>
				{children}
			</div>
		</div>
	)
}

//>