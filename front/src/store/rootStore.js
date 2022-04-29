import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { authApi } from '../services/authApi'
import authReducer from './auth/authSlice'
import registerReducer from './auth/registerSlice'

export const rootStore = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		auth: authReducer,
		register: registerReducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat([authApi.middleware])
	},
})

setupListeners(rootStore.dispatch)
