import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useTweet from '../../../hooks/useTweet'
import { authSelector } from '@store/auth/authSlice'
import { formatTimeDelta } from '@utils/date'
import Avatar from '../Avatar/Avatar'
import { CreatedAt, DeleteTweet, Message, Name, Username } from './components'
import styles from './Tweet.module.scss'
import Reply from './components/actions/Reply'
import Retweet from './components/actions/Retweet'
import Like from './components/actions/Like'

export default function Tweet({ id }) {
	let { tweet, relations, isLoading, isRetweet, isReply } = useTweet({ id })

	if (isLoading) {
		return null
	}

	return (
		<div className={styles.Container}>
			{isRetweet && <RetweetBadge author={tweet.author} />}
			{isReply && <ReplyBadge tweet={tweet.replyTo} />}
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

function ReplyBadge({ tweet }) {
	const username = tweet.author.username
	return (
		<div className={styles.RetweetBadge}>
			Replying to
			<Link className={styles.UserLink} to={`/profile/${username}`}>
				@{username}
			</Link>
		</div>
	)
}

function RetweetBadge({ author }) {
	const { user } = useSelector(authSelector)
	return (
		<div className={styles.RetweetBadge}>
			<i className="fa-solid fa-retweet"></i>
			{user.id === author.id ? 'You' : author.name} Retweeted
		</div>
	)
}

function Body({ tweet, relations }) {
	const { user } = useSelector(authSelector)
	let dateFormat = formatTimeDelta(new Date(tweet.createdAt), new Date())

	const isAuthor = user.id === tweet.author.id
	const { retweets, likes, replies } = tweet.count
	const { retweet: isRetweeted, reply: isReplied, like: isLiked } = relations

	return (
		<>
			<div className={styles.Avatar}>
				<Avatar src={tweet.author.avatar} />
			</div>
			<div className={styles.Content}>
				{isAuthor && <DeleteTweet id={tweet.id} />}
				<div className={styles.Meta}>
					<Name>{tweet.author.name}</Name>
					<Username>{tweet.author.username}</Username>
					<CreatedAt>{dateFormat}</CreatedAt>
				</div>
				<Message>{tweet.message}</Message>
				<div className={styles.Counters}>
					<Reply
						href={`/status/${tweet.author.username}/${tweet.id}`}
						isActive={isReplied}
					>
						{replies}
					</Reply>
					<Retweet isActive={isRetweeted} tweetId={tweet.id}>
						{retweets}
					</Retweet>
					<Like isActive={isLiked} tweetId={tweet.id}>
						{likes}
					</Like>
				</div>
			</div>
		</>
	)
}
