import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import config from '../config'

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}` }),
	endpoints: (builder) => ({
		authorize: builder.query({
			query: (token) => {
				return {
					url: '/auth/account',
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` },
				}
			},
			invalidatesTags: 'User',
		}),
	}),
})

export const { useLazyAuthorizeQuery } = userApi
