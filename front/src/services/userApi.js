import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import config from '../config'

export const userApi = createApi({
	reducerPath: 'userApi',
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
		}),
	}),
})

export const { useGetUserQuery } = userApi
