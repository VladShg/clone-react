import classNames from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import {
	useGetTweetQuery,
	useLikeMutation,
	useRetweetMutation,
	useTweetRelationsQuery,
} from '../../../services/tweetApi'
import { authSelector } from '../../../store/auth/authSlice'
import Avatar from '../Avatar/Avatar'
import DeleteTweet from './DeleteTweet'
import styles from './Tweet.module.scss'

export default function Tweet({ id }) {
	const { data: tweet, isLoading } = useGetTweetQuery(id)
	const { data: relations, isLoading: isRelationLoading } =
		useTweetRelationsQuery(id)

	// Retweet endpoint returns empty object {} when retweet is removed
	// Second check is for it
	// TODO: find a better way to check this
	if (isLoading || isRelationLoading || !tweet.id) {
		return null
	}

	if (tweet.isRetweet) {
		return (
			<div className={styles.Container}>
				<RetweetBadge author={tweet.author} />
				<div className={styles.Tweet}>
					<Body
						tweet={tweet.tweet}
						relations={relations}
						badge={<RetweetBadge author={tweet.tweet.author} />}
					/>
				</div>
			</div>
		)
	} else {
		return (
			<div className={styles.Container}>
				<div className={styles.Tweet}>
					<Body tweet={tweet} relations={relations} />
				</div>
			</div>
		)
	}
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
	const [triggerLike] = useLikeMutation()
	const [triggerRetweet] = useRetweetMutation()
	const { user } = useSelector(authSelector)
	const { like: isLiked, retweet: isRetweeted, reply: isReplied } = relations

	const onRetweet = async () => {
		await triggerRetweet(tweet.id)
	}

	const onLike = async () => {
		await triggerLike(tweet.id)
	}

	const date = new Date(tweet.createdAt)
	const now = new Date()
	let dateFormat = ''
	const hourDelta = (now.getTime() - date.getTime()) / 3600000
	if (hourDelta < 1) {
		const minuteDelta = (now.getTime() - date.getTime()) / 60000
		if (minuteDelta >= 1) {
			dateFormat = `${Math.floor(minuteDelta)} m`
		} else {
			dateFormat = 'now'
		}
	} else if (hourDelta < 24) {
		dateFormat = `${Math.floor(hourDelta)} h`
	} else {
		dateFormat = date.toLocaleDateString().slice(0, 5)
	}

	const isAuthor = user.id === tweet.author.id

	return (
		<>
			<div className={styles.Avatar}>
				<Avatar src="" />
			</div>
			<div className={styles.Content}>
				{isAuthor && <DeleteTweet id={tweet.id} />}
				<div className={styles.Meta}>
					<span className={styles.Name}>{tweet.author.name}</span>
					<span className={styles.Username}>@{tweet.author.username}</span>
					<span className={styles.Date}>{dateFormat}</span>
				</div>
				<div className={styles.Message}>{tweet.message}</div>
				<div className={styles.Counters}>
					<div
						className={classNames(styles.Reply, {
							[styles.Active]: isReplied,
						})}
					>
						<button className={styles.IconWrapper}>
							<i className="fa-solid fa-comment"></i>
						</button>
						{tweet.count.replies}
					</div>
					<div
						className={classNames(styles.Retweet, {
							[styles.Active]: isRetweeted,
						})}
					>
						<button className={styles.IconWrapper} onClick={onRetweet}>
							<i className="fa-solid fa-retweet"></i>
						</button>
						{tweet.count.retweets}
					</div>
					<div
						className={classNames(styles.Like, {
							[styles.Active]: isLiked,
						})}
						onClick={onLike}
					>
						<button className={styles.IconWrapper}>
							<i className="fa-solid fa-heart"></i>
						</button>
						{tweet.count.likes}
					</div>
					<div className={styles.Share}>
						<button className={styles.IconWrapper}>
							<i className="fa-solid fa-share"></i>
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
