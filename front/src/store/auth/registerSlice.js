import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	step: 1,
	isModalOpen: false,
	profile: {
		name: '',
		username: '',
		email: '',
		birth: '',
		googleId: '',
		githubId: '',
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
		loadProfile(state, action) {
			state.profile = { ...state.profile, ...action.payload }
			state.isModalOpen = true
		},
		nextStep(state) {
			state.step = Math.min(state.step + 1, REGISTER_STEPS)
		},
		previousStep(state) {
			state.step = Math.max(state.step - 1, 1)
		},
		setModal(state, action) {
			state.isModalOpen = action.payload
		},
	},
})

const registerReducer = registerSlice.reducer

export const { updateProfile, loadProfile, nextStep, previousStep, setModal } =
	registerSlice.actions
export const registerSelector = (state) => {
	return { ...state.register }
}

export default registerReducer
