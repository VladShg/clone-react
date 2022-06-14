import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useUserLikesQuery } from '@services/tweetApi'
import { authSelector } from '@store/auth/authSlice'
import Spinner from '@shared/Spinner/Spinner'
import Tweet from '@shared/Tweet/Tweet'
import { SpinnerContainer } from '../components/SpinnerContainer'

export default function ProfileLikes() {
	const username = useParams().username
	const { data: tweets, isLoading } = useUserLikesQuery(username)
	const { user } = useSelector(authSelector)

	if (isLoading || !user) {
		return (
			<SpinnerContainer>
				<Spinner size={100} />
			</SpinnerContainer>
		)
	}

	return tweets.map((tweet) => <Tweet key={tweet} id={tweet} />)
}
