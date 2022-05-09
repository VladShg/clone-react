import classNames from 'classnames'
import React from 'react'
import { useRetweetMutation } from '../../../../services/tweetApi'
import styles from '../Tweet.module.scss'

export default function Retweet({
	tweetId,
	children,
	isActive = false,
	className,
}) {
	const [triggerRetweet] = useRetweetMutation()
	const onRetweet = async () => {
		await triggerRetweet(tweetId)
	}
	const classes = classNames(styles.Retweet, {
		[styles.Active]: isActive,
		[className]: !!className,
	})

	return (
		<div className={classes}>
			<button className={styles.IconWrapper} onClick={onRetweet}>
				<i className="fa-solid fa-retweet"></i>
			</button>
			{children}
		</div>
	)
}
