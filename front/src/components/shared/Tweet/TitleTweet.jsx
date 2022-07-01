import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useTweet from '@hooks/useTweet'
import { authSelector } from '@store/auth/authSlice'
import Avatar from '../Avatar/Avatar'
import { CreatedAt, DeleteTweet, Message, Name, Username } from './components'

import styles from './TitleTweet.module.scss'
import { ActionContainer } from './components/actions/Actions'
import Reply from './components/actions/Reply'
import Retweet from './components/actions/Retweet'
import Like from './components/actions/Like'

export default function TitleTweet({ id }) {
	const { user } = useSelector(authSelector)
	const { isLoading, tweet, relations } = useTweet({ id })

	if (isLoading || !user) {
		return null
	}

	return (
		<div className={styles.Container}>
			<Link
				className={styles.Link}
				to={`/status/${tweet.author.username}/${tweet.id}`}
			/>
			<div className={styles.Tweet}>
				<Body tweet={tweet} relations={relations} />
			</div>
		</div>
	)
}

function Body({ tweet, relations }) {
	const { user } = useSelector(authSelector)
	const date = new Date(tweet.createdAt)

	const isAuthor = user.id === tweet.author.id
	const { retweets, likes, replies } = tweet.count
	const { retweet: isRetweeted, reply: isReplied, like: isLiked } = relations

	return (
		<>
			{isAuthor && <DeleteTweet id={tweet.id} />}
			<div className={styles.Head}>
				<div className={styles.Author}>
					<Avatar src={tweet.author.avatar} />
					<div className={styles.Credentials}>
						<Name>{tweet.author.name}</Name>
						<Username>{tweet.author.username}</Username>
					</div>
				</div>
				<Message className={styles.Message}>{tweet.message}</Message>
				<CreatedAt className={styles.CreatedAt}>
					{date.toDateString()}
				</CreatedAt>
			</div>
			<div className={styles.Counters}>
				<div className={styles.Counter}>
					<span className={styles.Count}>{retweets}</span>
					<span className={styles.Label}>Retweets</span>
				</div>
				<div className={styles.Counter}>
					<span className={styles.Count}>{likes}</span>
					<span className={styles.Label}>Likes</span>
				</div>
				<div className={styles.Counter}>
					<span className={styles.Count}>{replies}</span>
					<span className={styles.Label}>Replies</span>
				</div>
			</div>
			<ActionContainer>
				<Reply
					className={styles.Action}
					tweetId={tweet.id}
					isActive={isReplied}
				/>
				<Retweet
					className={styles.Action}
					tweetId={tweet.id}
					isActive={isRetweeted}
				/>
				<Like className={styles.Action} tweetId={tweet.id} isActive={isLiked} />
			</ActionContainer>
		</>
	)
}
