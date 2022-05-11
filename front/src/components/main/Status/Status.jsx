import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetRepliesQuery } from '../../../services/tweetApi'
import TitleTweet from '../../shared/Tweet/TitleTweet'
import WriteTweet from '../../shared/WriteTweet/WriteTweet'
import styles from './Status.module.scss'

export default function Status() {
	const { tweetId } = useParams()
	const { data: replies, isLoading } = useGetRepliesQuery(tweetId);

	return (
		<div className={styles.Container}>
			<div className={styles.NavBar}>
				<div className={styles.Wrapper}>
					<div className={styles.Background} />

					<div className={styles.Content}>
						<i className="fa-solid fa-arrow-left"></i>
						Tweet
					</div>
				</div>
			</div>
			<TitleTweet id={tweetId} key={tweetId} />
			<WriteTweet replyId={tweetId} placeholder="Write your reply" />
		</div>
	)
}
