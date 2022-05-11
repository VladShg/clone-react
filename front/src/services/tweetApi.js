import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import config from '../config'

export const tweetApi = createApi({
	reducerPath: 'tweetApi',
	tagTypes: ['Tweet', 'Reply'],
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
					tags = tags.concat([{ type: 'List', id: result.tweet.id }])
				}
				return tags
			},
		}),
		getReplies: builder.query({
			query: (tweetId) => {
				return {
					url: `/replies` + new URLSearchParams({ tweetId }),
					method: 'GET',
				}
			},
			transformResponse: (res) => res.map((tweet) => tweet.id),
			providesTags: (res, error, arg) => {
				return [{ type: 'Reply', id: arg }]
			},
		}),
		userTweets: builder.query({
			query: (username) => {
				return {
					url: `/tweets` + new URLSearchParams({ username }),
					method: 'GET',
				}
			},
			transformResponse: (data) => data.map((item) => item.id),
			providesTags: [{ type: 'Tweet', id: 'List' }],
		}),
		userLikes: builder.query({
			query: (username) => {
				return {
					url: `/likes` + new URLSearchParams({ username }),
					method: 'GET',
				}
			},
			transformResponse: (data) => data.map((item) => item.tweet.id),
			providesTags: [{ type: 'Like', id: 'List' }],
		}),
		userReplies: builder.query({
			query: (username) => {
				return {
					url: `/replies` + new URLSearchParams({ username }),
					method: 'GET',
				}
			},
			transformResponse: (data) => {
				return data.map((item) => item.id)
			},
			providesTags: [{ type: 'Reply', id: 'List' }],
		}),
		delete: builder.mutation({
			query: (id) => {
				return {
					url: '/',
					method: 'DELETE',
					body: { id },
				}
			},
			invalidatesTags: (res) => {
				let tags = [{ type: 'Tweet', id: 'List' }]
				if (res.isReply) {
					tags.push({ type: 'Reply', id: 'List' })
					tags.push({ type: 'Reply', id: res.replyId })
					tags.push({ type: 'Tweet', id: res.replyId })
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
			invalidatesTags: (res, error, arg) => {
				if (arg.replyId) {
					return [
						{ type: 'Reply', id: arg.replyId },
						{ type: 'Tweet', id: arg.replyId },
					]
				} else {
					return [{ type: 'Tweet', id: 'List' }]
				}
			},
		}),
		like: builder.mutation({
			query: (id) => {
				return {
					url: '/like',
					method: 'POST',
					body: { id },
				}
			},
			invalidatesTags: (result, error, arg) => [
				{ type: 'Tweet', id: arg },
				{ type: 'Like', id: 'List' },
			],
		}),
		tweetRelations: builder.query({
			query: (id) => {
				return {
					url: `/${id}/relations`,
					method: 'GET',
				}
			},
			providesTags: (res, error, arg) => [{ type: 'Tweet', id: arg }],
		}),
		retweet: builder.mutation({
			query: (id) => {
				return {
					url: '/retweet',
					method: 'POST',
					body: { id },
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
	useTweetRelationsQuery,
	useUserRepliesQuery,
	useUserLikesQuery,
	useUserTweetsQuery,
	useGetFeedQuery,
	useLikeMutation,
	useRetweetMutation,
	useCreateMutation,
	useGetTweetQuery,
	useDeleteMutation,
	useGetRepliesQuery,
} = tweetApi
