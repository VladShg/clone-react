import classNames from 'classnames'
import React from 'react'
import styles from '../Tweet.module.scss'

export default function Reply({ children, isActive = false, className }) {
	const classes = classNames(styles.Reply, {
		[styles.Active]: isActive,
		[className]: !!className,
	})
	return (
		<div className={classes}>
			<button className={styles.IconWrapper}>
				<i className="fa-solid fa-comment"></i>
			</button>
			{children}
		</div>
	)
}
