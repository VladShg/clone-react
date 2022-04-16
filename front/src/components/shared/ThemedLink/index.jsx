import React from "react"
import cNames from "classnames"
import { Link } from "react-router-dom"
import styles from "./ThemedLink.module.scss"

export default function ThemedLink({ to, children, theme, className }) {
	let classNames = cNames({
		[className]: className,
		[styles.primary]: theme === "primary",
		[styles.option]: theme === "option",
	})

	return (
		<Link to={to} className={classNames}>
			{children}
		</Link>
	)
}
