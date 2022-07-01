import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TweetAction } from './Actions'

export default function Reply({ isActive = false, children, href }) {
	const navigate = useNavigate()
	const onReply = () => {
		navigate(href)
	}

	return (
		<TweetAction
			value={children}
			color="reply"
			isActive={isActive}
			onClick={onReply}
		>
			<i className="fa-solid fa-comment"></i>
		</TweetAction>
	)
}
