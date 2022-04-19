import React, { useEffect, useRef } from "react"
import styles from "./ModalConfirm.module.scss"
import PropTypes from "prop-types"

ModalConfirm.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setOpen: PropTypes.func.isRequired,
	children: PropTypes.node,
}

export default function ModalConfirm({ isOpen, setOpen, children }) {
	const content = useRef(null)

	const checkClick = (event) => {
		if (!content.current.contains(event.target)) {
			setOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener("click", checkClick)
		return () => document.removeEventListener("click", checkClick)
	})

	if (!isOpen || !children) {
		return null
	}

	return (
		<div className={styles.wrapper}>
			<div ref={content} className={styles.container}>
				{children}
			</div>
		</div>
	)
}
