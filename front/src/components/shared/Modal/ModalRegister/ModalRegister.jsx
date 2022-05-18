import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import {
	useLazySignUpQuery,
	useValidateProfileQuery,
} from '../../../../services/authApi'
import { setToken } from '../../../../store/auth/authSlice'
import {
	nextStep,
	previousStep,
	registerSelector,
	updateProfile,
} from '../../../../store/auth/registerSlice'
import Modal from '../Modal'
import styles from './ModalRegister.module.scss'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

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

const partOneSchema = yup.object({
	name: yup.string().required('Name should not be empty'),
	email: yup
		.string()
		.email('Wrong email')
		.max(50)
		.required('Email should not be empty'),
	birth: yup
		.date()
		.required('Field is required')
		.nullable()
		.max(new Date(), 'Date should be less than or equal today')
		.min(new Date(1900, 1, 1), 'Date is too old')
		.transform(
			(v) => (v instanceof Date && !isNaN(v) ? v : null),
			'Enter a valid date'
		),
})

function PartOne() {
	const dispatch = useDispatch()
	const {
		register,
		handleSubmit,
		formState: { isValid, errors },
	} = useForm({
		resolver: yupResolver(partOneSchema),
		mode: 'onChange',
	})

	const onSubmit = (data) => {
		const { name, email, birth } = data
		dispatch(nextStep())
		dispatch(updateProfile({ name, email, birth }))
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Modal.Logo />
			<Modal.Close />
			<Modal.Title>Create your account</Modal.Title>
			<Modal.Input props={register('name')} placeholder="Name" />
			<Modal.Warning>{errors.name?.message}</Modal.Warning>
			<Modal.Input props={register('email')} placeholder="Email" />
			<Modal.Warning>{errors.email?.message}</Modal.Warning>
			<Modal.SubTitle>Date of birth</Modal.SubTitle>
			<Modal.Description>
				This will not be shown publicly. Confirm your own age, even if this
				account is for a business, a pet, or something else.
			</Modal.Description>
			<Modal.DatePicker props={register('birth')} />
			<Modal.Warning>{errors.birth?.message}</Modal.Warning>
			<Modal.Button disabled={!isValid} type="submit">
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
		let { data, isSuccess } = await triggerSignUp(profile)
		if (isSuccess) {
			dispatch(setToken(data.accessToken))
		} else {
			toast.error('Failed to register, please try again', {
				position: 'bottom-center',
			})
		}
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
