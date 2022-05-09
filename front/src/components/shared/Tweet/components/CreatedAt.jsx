import classNames from 'classnames'
import React from 'react'
import styles from '../Tweet.module.scss'

export default function CreatedAt({ children, className }) {
	const classes = classNames(styles.CreatedAt, {
		[className]: !!className,
	})
	return <div className={classes}>{children}</div>
}
