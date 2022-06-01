import React from 'react'
import styles from './Feed.module.scss'
import WriteTweet from '@shared/WriteTweet/WriteTweet'
import Tweet from '@shared/Tweet/Tweet'
import Spinner from '@shared/Spinner/Spinner'
import NavBar from '@shared/NavBar/NavBar'
import { useSelector } from 'react-redux'
import { useGetFeedQuery } from '@services/tweetApi'
import { authSelector } from '@store/auth/authSlice'
import { Container, Stack } from '@mui/material'

export default function Feed() {
	const { data: tweets, isLoading } = useGetFeedQuery()
	const { user } = useSelector(authSelector)

	if (isLoading || !user) {
		return (
			<Container sx={{ height: '100%' }} position="relative" >
				<Stack
					sx={{ width: '100%', height: '100%' }}
					alignItems="center"
					justifyContent="center"
				>
					<Spinner className={styles.Spinner} />
				</Stack>
			</Container>
		)
	}

	return (
		<Container height="100%" position="relative" disableGutters>
			<NavBar title="Home" />
			<WriteTweet border />
			{tweets.map((tweet) => (
				<Tweet key={tweet} id={tweet} />
			))}
		</Container>
	)
}
