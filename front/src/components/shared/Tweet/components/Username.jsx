import classNames from 'classnames'
import React from 'react'
import styles from '../Tweet.module.scss'

export default function Username({ children, className }) {
	const classes = classNames(styles.Username, { [className]: !!className })
	return <div className={classes}>@{children}</div>
}
