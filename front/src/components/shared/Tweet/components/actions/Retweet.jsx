import React from 'react'
import { useRetweetMutation } from '@services/tweetApi'
import { TweetAction } from './Actions'

// 	return (
// 		<div className={classes}>
// 			<button className={styles.IconWrapper} onClick={onRetweet}>
// 				<i className="fa-solid fa-retweet"></i>
// 			</button>
// 			{children}
// 		</div>
// 	)
// }

export default function Retweet({ children, isActive = false, tweetId }) {
	const [triggerRetweet] = useRetweetMutation()
	const onRetweet = async () => {
		await triggerRetweet(tweetId)
	}
	return (
		<TweetAction
			isActive={isActive}
			value={children}
			onClick={onRetweet}
			color="retweet"
		>
			<i className="fa-solid fa-retweet"></i>
		</TweetAction>
	)
}
