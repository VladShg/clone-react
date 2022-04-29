import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import config from '../config'

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/auth` }),
	endpoints: (builder) => ({
		googleLogin: builder.query({
			query: (token) => {
				return {
					url: '/google/login',
					method: 'POST',
					body: JSON.stringify({ token }),
				}
			},
		}),
		googleSignUp: builder.query({
			query: (token) => {
				return {
					url: '/google/signup',
					method: 'POST',
					body: JSON.stringify({ token }),
				}
			},
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

export const {
	useLazyGoogleConnectQuery,
	useLazyGitHubConnectQuery,
	useValidateProfileQuery,
} = authApi
