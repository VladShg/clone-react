import React from 'react'
import Spinner from '../../shared/Spinner/Spinner'
import Tweet from '../../shared/Tweet/Tweet'
import styles from './Status.module.scss'

export default function Replies({ replies, isLoading }) {
	if (isLoading) {
		return (
			<div className={styles.SpinnerContainer}>
				<Spinner size={100} />
			</div>
		)
	}
	return replies.map((tweetId) => {
		return <Tweet id={tweetId} key={tweetId} />
	})
}
