import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	step: 1,
	profile: {
		name: '',
		username: '',
		email: '',
		birth: '',
	},
}

const REGISTER_STEPS = 3

const registerSlice = createSlice({
	name: 'register',
	initialState,
	reducers: {
		updateProfile(state, action) {
			state.profile = { ...state.profile, ...action.payload }
		},
		nextStep(state) {
			state.step = Math.min(state.step + 1, REGISTER_STEPS)
		},
		previousStep(state) {
			state.step = Math.max(state.step - 1, 1)
		},
	},
})

const registerReducer = registerSlice.reducer

export const { updateProfile, nextStep, previousStep } = registerSlice.actions
export const registerSelector = (state) => {
	return { profile: state.register.profile, step: state.register.step }
}

export default registerReducer
