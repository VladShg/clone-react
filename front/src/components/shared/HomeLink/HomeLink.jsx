import classNames from "classnames"
import React from "react"
import { Link, useLocation } from "react-router-dom"
import { HomeStyles as styles } from "../../../styles/_Styles"
import PropTypes from "prop-types"

HomeLink.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
}

export default function HomeLink(props) {
	let localProps = { ...props }
	let location = useLocation()
	if (localProps.to && location.pathname === localProps.to) {
		let className = localProps.className || ""
		className = classNames(className, styles.active)
		localProps.className = className
	}
	return <Link {...localProps}>{props.children}</Link>
}
