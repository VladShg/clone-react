import { useGetTweetQuery, useTweetRelationsQuery } from '../services/tweetApi'
import { useGetAvatarQuery } from '../services/userApi'

export default function useTweet({ id }) {
	const { data: tweet, status, isLoading: isTweetLoading } = useGetTweetQuery(id)
	const { data: relations, isLoading: isRelationLoading } =
		useTweetRelationsQuery(tweet?.isRetweet ? tweet?.tweetId : tweet?.id, {
			skip: isTweetLoading,
		})

	let target = tweet
	if (tweet?.isRetweet) {
		target = tweet.tweet
	}

	const { data: avatar, isLoading: isAvatarLoading } = useGetAvatarQuery(
		tweet?.author?.username,
		{ skip: isTweetLoading }
	)

	const isLoading = isTweetLoading || isRelationLoading || isAvatarLoading
	if (!isLoading) {
		target = { ...target, author: { ...target.author, avatar } }
	}

	return {
		isLoading,
		tweet: target,
		relations,
		isRetweet: tweet?.isRetweet,
		isReply: tweet?.isReply,
	}
}
