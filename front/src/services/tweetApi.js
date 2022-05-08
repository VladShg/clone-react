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
		userTweets: builder.query({
			query: (username) => {
				return {
					url: `/${username}/tweets`,
					method: 'GET',
				}
			},
			transformResponse: (data) => data.map((item) => item.id),
			providesTags: [{ type: 'Tweet', id: 'LIST' }],
		}),
		userLikes: builder.query({
			query: (username) => {
				return {
					url: `/${username}/likes`,
					method: 'GET',
				}
			},
			transformResponse: (data) => data.map((item) => item.tweet.id),
			providesTags: [{ type: 'Tweet', id: 'LIST' }],
		}),
		delete: builder.mutation({
			query: (id) => {
				return {
					url: '/',
					method: 'DELETE',
					body: { id },
				}
			},
			invalidatesTags: [{ type: 'Tweet', id: 'List' }],
		}),
		create: builder.mutation({
			query: (message) => {
				return {
					url: '/',
					method: 'POST',
					body: { message },
				}
			},
			invalidatesTags: [{ type: 'Tweet', id: 'List' }],
		}),
		like: builder.mutation({
			query: (id) => {
				return {
					url: '/like',
					method: 'POST',
					body: { id },
				}
			},
			invalidatesTags: (result, error, arg) => [{ type: 'Tweet', id: arg }],
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
	useUserLikesQuery,
	useUserTweetsQuery,
	useGetFeedQuery,
	useLikeMutation,
	useRetweetMutation,
	useCreateMutation,
	useGetTweetQuery,
	useDeleteMutation,
} = tweetApi
