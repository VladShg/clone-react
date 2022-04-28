import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { authApi } from '../services/authApi'
import authReducer from './auth/authSlice'

export const rootStore = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		authReducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat([authApi.middleware])
	},
})

setupListeners(rootStore.dispatch)
