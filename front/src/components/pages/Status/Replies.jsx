import React from 'react'
import Spinner from '@shared/Spinner/Spinner'
import Tweet from '@shared/Tweet/Tweet'
import { Stack } from '@mui/material'

export const Wrapper = {}

export default function Replies({ replies, isLoading }) {
	if (isLoading) {
		return (
			<Stack height="100%" justifyContent="center" alignItems="center">
				<Spinner size={100} />
			</Stack>
		)
	}
	return replies.map((tweetId) => {
		return <Tweet id={tweetId} key={tweetId} />
	})
}
