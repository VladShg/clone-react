import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	useGetTweetQuery,
	useTweetRelationsQuery,
} from '../../../services/tweetApi'
import { authSelector } from '../../../store/auth/authSlice'
import Avatar from '../Avatar/Avatar'
import {
	CreatedAt,
	DeleteTweet,
	Like,
	Message,
	Name,
	Reply,
	Retweet,
	Username,
} from './components'
import styles from './TitleTweet.module.scss'

export default function TitleTweet({ id }) {
	let { data, isLoading } = useGetTweetQuery(id)
	const { data: relations, isLoading: isRelationLoading } =
		useTweetRelationsQuery(data?.isRetweet ? data?.tweetId : data?.id, {
			skip: !data,
		})

	if (isLoading || isRelationLoading || !data.id || !relations) {
		return null
	}

	let tweet = data
	let isRetweet = data.isRetweet
	if (isRetweet) {
		tweet = data.tweet
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
					<Avatar src="" />
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
			<div className={styles.Actions}>
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
			</div>
		</>
	)
}
