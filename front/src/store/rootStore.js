import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { authApi } from '../services/authApi'
import { tweetApi } from '../services/tweetApi'
import { userApi } from '../services/userApi'
import authReducer from './auth/authSlice'
import registerReducer from './auth/registerSlice'

export const rootStore = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
		[tweetApi.reducerPath]: tweetApi.reducer,
		auth: authReducer,
		register: registerReducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat([
			authApi.middleware,
			userApi.middleware,
			tweetApi.middleware,
		])
	},
})

setupListeners(rootStore.dispatch)
