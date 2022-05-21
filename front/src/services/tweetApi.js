import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import config from '../config'

export const tweetApi = createApi({
	reducerPath: 'tweetApi',
	tagTypes: ['Tweet', 'Reply', 'Relation'],
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
					tags.push({ type: 'Tweet', id: result.tweet.id })
				}
				return tags
			},
		}),
		getReplies: builder.query({
			query: (tweetId) => {
				return {
					params: new URLSearchParams({ tweetId }),
					url: `/replies`,
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
					params: new URLSearchParams({ username }),
					url: `/tweets`,
					method: 'GET',
				}
			},
			transformResponse: (data) => data.map((item) => item.id),
			providesTags: [{ type: 'Tweet', id: 'List' }],
		}),
		userLikes: builder.query({
			query: (username) => {
				return {
					params: new URLSearchParams({ username }),
					url: `/likes`,
					method: 'GET',
				}
			},
			transformResponse: (data) => data.map((item) => item.tweet.id),
			providesTags: [{ type: 'Like', id: 'List' }],
		}),
		userReplies: builder.query({
			query: (username) => {
				return {
					params: new URLSearchParams({ username }),
					url: `/replies`,
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
			invalidatesTags: [{ type: 'Tweet', id: 'List' }],
		}),
		reply: builder.mutation({
			query: (body) => {
				return {
					url: '/reply',
					method: 'POST',
					body: body,
				}
			},
			invalidatesTags: (res, error, arg) => {
				return [
					{ type: 'Reply', id: arg.replyId },
					{ type: 'Tweet', id: arg.replyId },
				]
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
			providesTags: (res, error, arg) => [
				{ type: 'Tweet', id: arg },
				{ type: 'Relation' },
			],
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
	useReplyMutation,
	useGetTweetQuery,
	useDeleteMutation,
	useGetRepliesQuery,
} = tweetApi
