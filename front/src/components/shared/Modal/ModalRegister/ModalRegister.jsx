import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	useLazySignUpQuery,
	useValidateProfileQuery,
} from '../../../../services/authApi'
import {
	nextStep,
	previousStep,
	registerSelector,
	updateProfile,
} from '../../../../store/auth/registerSlice'
import Modal from '../Modal'
import styles from './ModalRegister.module.scss'

export default function ModalRegister({ isOpen, setOpen }) {
	const { step } = useSelector(registerSelector)
	const getCurrent = () => {
		switch (step) {
			case 1:
				return <PartOne />
			case 2:
				return <PartTwo />
			case 3:
				return <PartThree />
		}
	}

	return (
		<Modal isOpen={isOpen} setOpen={setOpen} className={styles.Register}>
			{getCurrent()}
		</Modal>
	)
}

function PartOne() {
	const { name, email, birth } = useSelector(registerSelector).profile
	const dispatch = useDispatch()

	let { data, isLoading, isFetching } = useValidateProfileQuery(
		{ email: email },
		{ skip: !email }
	)

	const isNotValidEmail = !isFetching && !isLoading && data && !data.isAvailable
	const isNextDisabled = !birth || !email || !name || isNotValidEmail

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				dispatch(nextStep())
			}}
		>
			<Modal.Logo />
			<Modal.Close />
			<Modal.Title>Create your account</Modal.Title>
			<Modal.Input
				required
				maxLength="50"
				value={name}
				onChange={(e) => dispatch(updateProfile({ name: e.target.value }))}
				placeholder="Name"
				type="text"
			/>

			<Modal.Input
				required
				value={email}
				maxLength="50"
				onChange={(e) => dispatch(updateProfile({ email: e.target.value }))}
				placeholder="Email"
				type="email"
			/>
			<Modal.Warning>
				{isNotValidEmail && 'Email has already been taken.'}
			</Modal.Warning>
			<Modal.SubTitle>Date of birth</Modal.SubTitle>
			<Modal.Description>
				This will not be shown publicly. Confirm your own age, even if this
				account is for a business, a pet, or something else.
			</Modal.Description>
			<Modal.DatePicker
				required
				value={birth}
				min="1900-01-01"
				max={new Date().toISOString().slice(0, 10)}
				onChange={(e) => dispatch(updateProfile({ birth: e.target.value }))}
			/>
			<Modal.Button disabled={isNextDisabled} type="submit">
				Next
			</Modal.Button>
		</form>
	)
}

function PartTwo() {
	const { username } = useSelector(registerSelector).profile
	const isValidUsername = /^[\w]{3,20}$/.test(username)
	const dispatch = useDispatch()

	let { data, isLoading, isFetching } = useValidateProfileQuery(
		{ username: username },
		{ skip: !isValidUsername }
	)

	const isAvailableUsername = data && data.isAvailable
	const isNextDisabled = !username || !isAvailableUsername || !isValidUsername

	let warning = ''
	if (username && username.length < 3) {
		warning = 'Username is too short'
	} else if (username.length > 20) {
		warning = 'Username is too long'
	} else if (username && !isValidUsername) {
		warning = 'Only latin symbols, numbers or underscores are allowed'
	} else if (username && !isAvailableUsername) {
		warning = 'Username is taken'
	}

	return (
		<form
			onSubmit={(e) => {
				if (!isFetching && !isLoading) {
					e.preventDefault()
					dispatch(nextStep())
				}
			}}
		>
			<Modal.Back onClick={() => dispatch(previousStep())} />
			<Modal.Logo />
			<Modal.Title>Choose a username</Modal.Title>
			<Modal.Input
				type="text"
				placeholder="username"
				regex="^[\w]{3,20}$"
				value={username}
				onChange={(e) => dispatch(updateProfile({ username: e.target.value }))}
			/>
			<Modal.Warning>{warning}</Modal.Warning>
			<Modal.Button disabled={isNextDisabled}>Next</Modal.Button>
		</form>
	)
}

function PartThree() {
	const state = useSelector(registerSelector)
	const { password, passwordConfirm, googleId, gitHubId } = state.profile
	const [triggerSignUp] = useLazySignUpQuery()
	const dispatch = useDispatch()

	let match = password && passwordConfirm && password === passwordConfirm
	let warning = ''
	if (password && passwordConfirm && !match) {
		warning = "Passwords don't match"
	}

	const submitAuth = async (e) => {
		e.preventDefault()
		// eslint-disable-next-line no-unused-vars
		let { passwordConfirm, ...profile } = Object.assign({}, state.profile)
		if (!match) {
			delete profile.password
		}
		console.log(profile)
		let response = await triggerSignUp(profile)
		console.log(response)
	}

	return (
		<form onSubmit={submitAuth}>
			<Modal.Back onClick={() => dispatch(previousStep())} />
			<Modal.Logo />
			<Modal.Title>Enter password</Modal.Title>
			<Modal.Input
				minLength={8}
				maxLength={20}
				placeholder="Password"
				type="password"
				onChange={(e) => {
					dispatch(updateProfile({ password: e.target.value }))
				}}
				value={password}
			/>
			<Modal.Input
				minLength={8}
				maxLength={20}
				placeholder="Confirm password"
				type="password"
				onChange={(e) => {
					dispatch(updateProfile({ passwordConfirm: e.target.value }))
				}}
				value={passwordConfirm}
			/>
			<Modal.Warning>{warning}</Modal.Warning>
			<Modal.Button type="submit" disabled={!match}>
				Submit
			</Modal.Button>
			{(googleId || gitHubId) && (
				<Modal.Button type="submit">Skip</Modal.Button>
			)}
		</form>
	)
}
