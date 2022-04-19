import faker from "@faker-js/faker"
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	token: "",
	user: {
		name: faker.name.findName(),
		username: faker.name.firstName(),
		avatar: faker.image.avatar(),
	},
}

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setToken(state, action) {
			state.token = action.payload
		},
		logout(state) {
			state.token = ""
		},
	},
})

const authReducer = authSlice.reducer

export const { setToke, logout } = authSlice.actions
export const authSelector = (state) => {
	console.log(state)
	return { token: state.auth.token, user: state.auth.user }
}

export default authReducer
