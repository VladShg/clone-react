import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import config from '../config'

export const tweetApi = createApi({
	reducerPath: 'tweetApi',
	tagTypes: ['Tweet'],
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}/tweet`,
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.token
			headers.set('authorization', `Bearer ${token}`)
			return headers
		},
	}),
	endpoints: (builder) => ({
		getFeed: builder.query({
			query: () => {
				return {
					url: '/feed',
					method: 'GET',
				}
			},
			transformResponse: (data) => data.map((item) => item.id),
			providesTags: [{ type: 'Tweet', id: 'List' }],
		}),
		getTweet: builder.query({
			query: (id) => {
				return {
					url: '/' + id,
					method: 'GET',
				}
			},
			providesTags: (result) => {
				let tags = [{ type: 'Tweet', id: result.id }]
				if (result.isRetweet) {
					tags = tags.concat([{ type: 'Tweet', id: result.tweet.id }])
				}
				return tags
			},
		}),
		create: builder.mutation({
			query: (body) => {
				return {
					url: '/',
					method: 'POST',
					body: body,
				}
			},
			invalidatesTags: [{ type: 'Tweet', id: 'List' }],
		}),
		like: builder.mutation({
			query: (tweetId) => {
				return {
					url: '/like',
					method: 'POST',
					body: { id: tweetId },
				}
			},
			invalidatesTags: (result, error, arg) => [{ type: 'Tweet', id: arg }],
		}),
		retweet: builder.mutation({
			query: (tweetId) => {
				return {
					url: '/retweet',
					method: 'POST',
					body: { tweetId: tweetId },
				}
			},
			invalidatesTags: (result, error, arg) => {
				let tags = [
					{ type: 'Tweet', id: arg },
					{ type: 'Tweet', id: 'List' },
				]
				if (result?.isRetweet) {
					tags.push({ type: 'Tweet', id: result.tweet.id })
				}
				return tags
			},
		}),
	}),
})

export const {
	useGetFeedQuery,
	useLikeMutation,
	useRetweetMutation,
	useCreateMutation,
	useGetTweetQuery,
} = tweetApi
