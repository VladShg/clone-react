import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const initialState = {
	token: Cookies.get('token'),
	user: null,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setToken(state, action) {
			Cookies.set('token', action.payload)
			state.token = action.payload
		},
		logout(state) {
			Cookies.set('token', '')
			state.user = null
			state.token = ''
		},
		setUser(state, action) {
			state.user = action.payload
		},
	},
})

const authReducer = authSlice.reducer

export const { setToken, logout, setUser } = authSlice.actions
export const authSelector = (state) => {
	return { token: state.auth.token, user: state.auth.user }
}

export default authReducer
