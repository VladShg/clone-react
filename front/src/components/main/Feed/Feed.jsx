import React from 'react'
import styles from './Feed.module.scss'
import Header from '../../shared/Header/Header'
import WriteTweet from '../../shared/WriteTweet/WriteTweet'
import { useGetFeedQuery } from '../../../services/tweetApi'
import Tweet from '../../shared/Tweet/Tweet'
import { useSelector } from 'react-redux'
import { authSelector } from '../../../store/auth/authSlice'
import Spinner from '../../shared/Spinner/Spinner'

export default function Feed() {
	const { data: tweets, isLoading } = useGetFeedQuery()
	const { user } = useSelector(authSelector)

	if (isLoading || !user) {
		return (
			<div className={styles.container}>
				<div className={styles.SpinnerContainer}>
					<Spinner className={styles.Spinner} />
				</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<Header>
				<span>Home</span>
				<i className="fa-solid fa-wand-magic-sparkles" />
			</Header>
			<WriteTweet />
			{!isLoading &&
				user &&
				tweets.map((tweet) => <Tweet key={tweet} id={tweet} />)}
		</div>
	)
}
