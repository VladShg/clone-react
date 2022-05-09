import classNames from 'classnames'
import React from 'react'
import styles from '../Tweet.module.scss'

export default function Message({ children, className }) {
	const classes = classNames(styles.Message, {
		[className]: !!className,
	})
	return <div className={classes}>{children}</div>
}
