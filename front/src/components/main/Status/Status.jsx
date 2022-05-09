import React from 'react'
import { useParams } from 'react-router-dom'
import TitleTweet from '../../shared/Tweet/TitleTweet'

export default function Status() {
	const { tweetId } = useParams()

	return <TitleTweet id={tweetId} key={tweetId} />
}
