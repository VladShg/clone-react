import classNames from 'classnames'
import React from 'react'
import styles from '../Tweet.module.scss'

export default function Name({ children, className }) {
	const classes = classNames(styles.Name, {
		[className]: !!className,
	})
	return <div className={classes}>{children}</div>
}
