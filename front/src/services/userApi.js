import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import config from '../config'
import { base64decode } from '../utils/image'

export const userApi = createApi({
	reducerPath: 'userApi',
	tagTypes: ['User'],
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}`,
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.token
			headers.set('authorization', `Bearer ${token}`)
			return headers
		},
	}),
	endpoints: (builder) => ({
		getUser: builder.query({
			query: (username) => {
				return {
					url: '/user/' + username,
					method: 'GET',
				}
			},
			providesTags: (result, error, username) => ['User', username],
		}),
		getAvatar: builder.query({
			query: (username) => {
				return {
					url: `/user/${username}/avatar`,
					method: 'GET',
				}
			},
			transformResponse: (res) => {
				return base64decode(res?.image)
			},
			providesTags: (result, error, username) => ['User', username],
		}),
	}),
})

export const { useGetUserQuery, useGetAvatarQuery, useLazyGetAvatarQuery } =
	userApi
