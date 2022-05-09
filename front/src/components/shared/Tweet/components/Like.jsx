import React from 'react'
import classNames from 'classnames'
import styles from '../Tweet.module.scss'
import { useLikeMutation } from '../../../../services/tweetApi'

export default function Like({
	tweetId,
	children,
	isActive = false,
	className,
}) {
	const [triggerLike] = useLikeMutation()
	const onLike = async () => {
		await triggerLike(tweetId)
	}

	const classes = classNames(styles.Like, {
		[styles.Active]: isActive,
		[className]: !!className,
	})

	return (
		<div className={classes} onClick={onLike}>
			<button className={styles.IconWrapper}>
				<i className="fa-solid fa-heart"></i>
			</button>
			{children}
		</div>
	)
}
