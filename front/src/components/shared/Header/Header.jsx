import React from 'react'
import styles from './Header.module.scss'
import PropTypes from 'prop-types'

Header.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
	height: PropTypes.number,
}

export default function Header({ children, height }) {
	return (
		<div className={styles.header} style={{ height }}>
			{children}
		</div>
	)
}
