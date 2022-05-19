import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useLazySignUpQuery } from '../../../../services/authApi'
import { setToken } from '../../../../store/auth/authSlice'
import {
	nextStep,
	previousStep,
	registerSelector,
	updateProfile,
} from '../../../../store/auth/registerSlice'
import { validateEmail, validateUsername } from '../../../../utils/api'
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
		.required('Email should not be empty')
		.test('email-available', 'Email is taken', async (email) => {
			return !!email && (await validateEmail(email))
		}),
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
		let { name, email, birth } = data
		birth = new Date(birth).toISOString()
		dispatch(updateProfile({ name, email, birth }))
		dispatch(nextStep())
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

const partTwoSchema = yup
	.object({
		username: yup
			.string()
			.matches(
				/^[\w]*$/,
				'Only latin symbols, numbers or underscores are allowed'
			)
			.min(3, 'Username too short')
			.max(20, 'Username too long')
			.test('username-available', 'Username is taken', async (email) => {
				return !!email && (await validateUsername(email))
			})
			.required('Username should not be empty'),
	})
	.required()

function PartTwo() {
	const dispatch = useDispatch()
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(partTwoSchema),
		mode: 'onChange',
	})

	const onSubmit = (data) => {
		dispatch(updateProfile({ username: data.username }))
		dispatch(nextStep())
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Modal.Back onClick={() => dispatch(previousStep())} />
			<Modal.Logo />
			<Modal.Title>Choose a username</Modal.Title>
			<Modal.Input
				type="text"
				placeholder="Username"
				props={register('username')}
			/>
			<Modal.Warning>{errors.username?.message}</Modal.Warning>
			<Modal.Button disabled={!isValid}>Next</Modal.Button>
		</form>
	)
}

const partThreeResolver = yup
	.object({
		password: yup
			.string()
			.min(8, 'Password too short')
			.max(40, 'Password too long')
			.required('Password should not be empty'),
		confirm: yup
			.string()
			.oneOf([yup.ref('password')], 'Passwords dont match')
			.required('Confirm your password'),
	})
	.required()

function PartThree() {
	const state = useSelector(registerSelector)
	const { googleId, gitHubId } = state.profile
	const [triggerSignUp] = useLazySignUpQuery()
	const dispatch = useDispatch()
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(partThreeResolver),
		mode: 'onChange',
	})

	const signUp = async (profile) => {
		let { data, isSuccess } = await triggerSignUp(profile)
		if (isSuccess) {
			dispatch(setToken(data.accessToken))
		} else {
			toast.error('Failed to register, please try again', {
				position: 'bottom-center',
			})
		}
	}

	const skipPassword = async () => {
		await signUp(state.profile)
	}

	const onSubmit = async (input) => {
		let profile = { ...state.profile, password: input.password }
		await signUp(profile)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Modal.Back onClick={() => dispatch(previousStep())} />
			<Modal.Logo />
			<Modal.Title>Enter password</Modal.Title>
			<Modal.Input
				placeholder="Password"
				type="password"
				props={register('password')}
			/>
			<Modal.Input
				placeholder="Confirm password"
				type="password"
				props={register('confirm')}
			/>
			<Modal.Warning>
				{errors.password?.message || errors.confirm?.message}
			</Modal.Warning>
			<Modal.Button type="submit" disabled={!isValid}>
				Submit
			</Modal.Button>
			{(googleId || gitHubId) && (
				<Modal.Button onClick={skipPassword}>Skip</Modal.Button>
			)}
		</form>
	)
}
