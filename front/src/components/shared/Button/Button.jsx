import React from 'react'
import PropTypes from 'prop-types'
import styles from './Button.module.scss'

Button.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
	disabled: PropTypes.bool.isRequired,
}

export default function Button({ children, disabled = false }) {
	return (
		<button className={styles.button} disabled={disabled}>
			{children}
		</button>
	)
}
