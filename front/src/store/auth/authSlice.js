import faker from '@faker-js/faker'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	token: '',
	user: {
		name: faker.name.findName(),
		username: faker.name.firstName(),
		avatar: faker.image.avatar(),
	},
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
		},
	},
})

const authReducer = authSlice.reducer

export const { setToken, logout } = authSlice.actions
export const authSelector = (state) => {
	return { token: state.authReducer.token, user: state.authReducer.user }
}

export default authReducer
