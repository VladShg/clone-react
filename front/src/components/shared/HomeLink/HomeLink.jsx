import classNames from "classnames"
import React from "react"
import { NavLink } from "react-router-dom"
import { HomeStyles as styles } from "../../../styles/_Styles"
import PropTypes from "prop-types"

HomeLink.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
}

export default function HomeLink(props) {
	let { className, ...localProps } = { ...props }
	const getStyles = ({ isActive }) => {
		let regular = className || ""
		if (isActive) return classNames(regular, styles.active)
		return regular
	}
	return (
		<NavLink {...localProps} className={getStyles}>
			{props.children}
		</NavLink>
	)
}
