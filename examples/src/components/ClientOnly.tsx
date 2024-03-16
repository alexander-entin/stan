import { useState, useEffect } from 'react'

export function ClientOnly({ children }) {
	const [show, setShow] = useState(false)
	useEffect(() => {
		setShow(true)
	}, [])
	return <>
		{show && children}
	</>
}