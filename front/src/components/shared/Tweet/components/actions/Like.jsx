import React from 'react'
import { useLikeMutation } from '@services/tweetApi'
import { TweetAction } from './Actions'

export default function Like({ tweetId, isActive = false, children }) {
	const [triggerLike] = useLikeMutation()
	const onLike = async () => {
		await triggerLike(tweetId)
	}

	return (
		<TweetAction
			value={children}
			isActive={isActive}
			color="like"
			onClick={onLike}
		>
			<i className="fa-solid fa-heart"></i>
		</TweetAction>
	)
}
