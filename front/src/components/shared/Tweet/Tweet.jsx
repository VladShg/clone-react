import React from 'react'
import { useSelector } from 'react-redux'
import {
	useGetTweetQuery,
	useLikeMutation,
	useRetweetMutation,
} from '../../../services/tweetApi'
import { authSelector } from '../../../store/auth/authSlice'
import Avatar from '../Avatar/Avatar'
import styles from './Tweet.module.scss'

export default function Tweet({ id }) {
	const { data: tweet, isLoading } = useGetTweetQuery(id)

	// Retweet endpoint returns empty object {} when retweet is removed
	// Second check is for it
	// TODO: find a better way to check this
	if (isLoading || !tweet.id) {
		return null
	}

	if (tweet.isRetweet) {
		return (
			<div className={styles.Container}>
				<RetweetBadge author={tweet.author} />
				<div className={styles.Tweet}>
					<Body
						tweet={tweet.tweet}
						badge={<RetweetBadge author={tweet.tweet.author} />}
					/>
				</div>
			</div>
		)
	} else {
		return (
			<div className={styles.Container}>
				<div className={styles.Tweet}>
					<Body tweet={tweet} />
				</div>
			</div>
		)
	}
}

function RetweetBadge({ author }) {
	return (
		<div className={styles.RetweetBadge}>
			<i className="fa-solid fa-retweet"></i>
			{author.name} Retweeted
		</div>
	)
}

function Body({ tweet }) {
	const [triggerLike] = useLikeMutation()
	const [triggerRetweet] = useRetweetMutation()
	const { user } = useSelector(authSelector)
	const retweetDisabled = user.id === tweet.author.id

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

	return (
		<>
			<div className={styles.Avatar}>
				<Avatar src="" />
			</div>
			<div className={styles.Content}>
				<div className={styles.Meta}>
					<span className={styles.Name}>{tweet.author.name}</span>
					<span className={styles.Username}>@{tweet.author.username}</span>
					<span className={styles.Date}>{dateFormat}</span>
				</div>
				<div className={styles.Message}>{tweet.message}</div>
				<div className={styles.Counters}>
					<div className={styles.Reply}>
						<div className="Icon">
							<i className="fa-solid fa-comment"></i>
						</div>
						{tweet._count.replies}
					</div>
					<div className={styles.Retweet}>
						<div
							className="Icon"
							disabled={retweetDisabled}
							onClick={onRetweet}
						>
							<i className="fa-solid fa-retweet"></i>
						</div>
						{tweet._count.retweets}
					</div>
					<div className={styles.Like} onClick={onLike}>
						<div className="Icon">
							<i className="fa-solid fa-heart"></i>
						</div>
						{tweet._count.likes}
					</div>
					<div className={styles.Share}>
						<div className="Icon">
							<i className="fa-solid fa-share"></i>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
