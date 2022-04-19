import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth/authSlice"

export const rootStore = configureStore({
	reducer: {
		auth: authReducer,
	},
})
