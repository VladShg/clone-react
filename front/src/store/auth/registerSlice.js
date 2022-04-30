import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	step: 1,
	isLoginModalOpen: false,
	isRegisterModalOpen: false,
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
			state.isRegisterModalOpen = true
		},
		closeRegisterModal(state) {
			state.step = 1
			state.isRegisterModalOpen = false
			state.profile.name = ''
			state.profile.username = ''
			state.profile.email = ''
			state.profile.birth = ''
			state.profile.googleId = ''
			state.profile.githubId = ''
		},
		nextStep(state) {
			state.step = Math.min(state.step + 1, REGISTER_STEPS)
		},
		previousStep(state) {
			state.step = Math.max(state.step - 1, 1)
		},
		setLoginModal(state, action) {
			state.isLoginModalOpen = action.payload
		},
		setRegisterModal(state, action) {
			state.isRegisterModalOpen = action.payload
		},
	},
})

const registerReducer = registerSlice.reducer

export const {
	updateProfile,
	loadProfile,
	nextStep,
	previousStep,
	setLoginModal,
	setRegisterModal,
	resetInput,
	closeRegisterModal,
} = registerSlice.actions
export const registerSelector = (state) => {
	return { ...state.register }
}

export default registerReducer
