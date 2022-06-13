import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetRepliesQuery, useReplyMutation } from '@services/tweetApi'
import TitleTweet from '@shared/Tweet/TitleTweet'
import WriteTweet from '@shared/WriteTweet/WriteTweet'
import NavBar from '@shared/NavBar/NavBar'
import Replies from './Replies'
import { Stack } from '@mui/material'

export default function Status() {
	const { tweetId } = useParams()
	const { data: replies, isLoading } = useGetRepliesQuery(tweetId)

	return (
		<Stack sx={{ position: 'relative', height: '100%' }}>
			<NavBar title="Tweet" navigateBack />
			<TitleTweet id={tweetId} key={tweetId} />
			<WriteTweet
				border
				replyId={tweetId}
				useWrite={useReplyMutation}
				placeholder="Write your reply"
			/>
			<Replies replies={replies} isLoading={isLoading} />
		</Stack>
	)
}
