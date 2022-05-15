import React from 'react'
import { useParams } from 'react-router-dom'
import {
	useGetRepliesQuery,
	useReplyMutation,
} from '../../../services/tweetApi'
import TitleTweet from '../../shared/Tweet/TitleTweet'
import WriteTweet from '../../shared/WriteTweet/WriteTweet'
import NavBar from '../../shared/NavBar/NavBar'
import Replies from './Replies'
import styles from './Status.module.scss'

export default function Status() {
	const { tweetId } = useParams()
	const { data: replies, isLoading } = useGetRepliesQuery(tweetId)

	return (
		<div className={styles.Container}>
			<NavBar title="Tweet" navigateBack />
			<TitleTweet id={tweetId} key={tweetId} />
			<WriteTweet
				replyId={tweetId}
				useWrite={useReplyMutation}
				placeholder="Write your reply"
			/>
			<Replies replies={replies} isLoading={isLoading} />
		</div>
	)
}
