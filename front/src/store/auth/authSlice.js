import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	token: '',
	user: null,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setToken(state, action) {
			state.token = action.payload
		},
		logout(state) {
			state.token = ''
			state.user = null
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
