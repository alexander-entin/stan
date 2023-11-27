import React from 'react'
import { ReactNode } from "react"
import { usePageContext } from "vike-react/usePageContext"

export function Link(
	{ href, children, className, activeClassName } :
	{ href: string, children: ReactNode, className?: string, activeClassName?: string }
) {
	const { urlPathname } = usePageContext()
	const isActive = href === "/" ? urlPathname === href : urlPathname.startsWith(href)
	return (
		<a href={href} className={`${className} ${isActive ? activeClassName : ''}`}>
			{children}
		</a>
	)
}
