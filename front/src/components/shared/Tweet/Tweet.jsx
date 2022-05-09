import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	useGetTweetQuery,
	useTweetRelationsQuery,
} from '../../../services/tweetApi'
import { authSelector } from '../../../store/auth/authSlice'
import { formatTimeDelta } from '../../../utils/date'
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
import styles from './Tweet.module.scss'

export default function Tweet({ id }) {
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
			{isRetweet && <RetweetBadge author={tweet.author} />}
			<Link
				className={styles.Link}
				to={`/status/${tweet.author.username}/${tweet.id}`}
			/>
			<div className={styles.Tweet}>
				<Body
					tweet={tweet}
					relations={relations}
					badge={<RetweetBadge author={tweet.author} />}
				/>
			</div>
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
				<Avatar src="" />
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
					<Reply isActive={isReplied}>{replies}</Reply>
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
