import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import config from '../config'
import { tweetApi } from './tweetApi'

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/auth` }),
	endpoints: (builder) => ({
		googleLogin: builder.query({
			query: (token) => {
				return {
					url: '/google/login',
					method: 'POST',
					body: { token },
				}
			},
		}),
		gitHubLogin: builder.query({
			query: (code) => {
				return {
					url: '/github/login',
					method: 'POST',
					body: { code },
				}
			},
		}),
		signUp: builder.mutation({
			query: (body) => {
				return {
					url: '/signup',
					method: 'POST',
					body: body,
				}
			},
		}),
		login: builder.query({
			query: (body) => {
				return {
					url: '/login',
					method: 'POST',
					body: body,
				}
			},
		}),
		authorize: builder.query({
			query: (token) => {
				return {
					url: '/account',
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` },
				}
			},
			invalidatesTags: (response) => [{ type: 'User', id: response.id }],
		}),
		googleConnect: builder.query({
			query: (token) => {
				return {
					url: '/google/connect',
					method: 'POST',
					body: { token },
				}
			},
		}),
		gitHubConnect: builder.query({
			query: (code) => {
				return {
					url: '/github/connect',
					method: 'POST',
					body: { code },
				}
			},
		}),
		validateProfile: builder.query({
			query: (params) => {
				return {
					url: '/lookup',
					method: 'GET',
					params: params,
				}
			},
		}),
		emailLogin: builder.query({
			query: (username, password) => {
				return {
					url: '/login/email',
					method: 'POST',
					body: JSON.stringify({ username, password }),
				}
			},
		}),
	}),
})

// TODO refactor with toolkit
export const logoutCleanup = () => tweetApi.util.invalidateTags(['Relation'])

export const {
	useLazyLoginQuery,
	useLazyGitHubLoginQuery,
	useLazyGoogleLoginQuery,
	useSignUpMutation,
	useLazyGoogleConnectQuery,
	useLazyGitHubConnectQuery,
	useValidateProfileQuery,
	useLazyAuthorizeQuery,
} = authApi
