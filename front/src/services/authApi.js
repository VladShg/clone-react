import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../config'

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/auth` }),
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
				console.log('token', token)
				return {
					url: '/google/connect',
					method: 'POST',
					body: { token },
				}
			},
		}),
		validateProfile: builder.query({
			query: (params) => {
				return {
					url: '/lookup',
					method: 'GET',
					params: params
				}
			}
		}),
		emailLogin: builder.query({
			query: (username, password) => {
				return {
					url: '/login/email',
					method: 'POST',
					body: JSON.stringify({ username, password }),
				}
			},
			transformResponse: (response, meta, arg) => {
				console.log('Transform - email', response, meta, arg)
				return response.data
			},
		}),
	}),
})

export const { useLazyGoogleConnectQuery, useValidateProfileQuery } = authApi
