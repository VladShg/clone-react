import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { previousStep, registerSelector } from '@store/auth/registerSlice'
import Modal from '../../Modal'
import { useSignUpMutation } from '@services/authApi'
import { setToken } from '@store/auth/authSlice'
import toast from 'react-hot-toast'

const schema = yup
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

export default function PasswordStep({ image }) {
	const state = useSelector(registerSelector)
	const { googleId, gitHubId } = state.profile
	const [triggerSignUp] = useSignUpMutation()
	const dispatch = useDispatch()
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
	})

	console.log(image)

	const signUp = async (profile) => {
		const toastError = () => {
			toast.error('Failed to register, please try again', {
				position: 'bottom-center',
			})
		}

		let body = new FormData()
		// Nest has an issue with validating form-data
		// There is a strange conversion that process null values as 'null'
		// Inside validation pipes, empty keys are filtered to avoid that
		// TODO: add custom pipes and remove this
		for (let key of Object.keys(profile)) {
			if (profile[key]) {
				body.append(key, profile[key])
			}
		}
		body.append('avatar', image)
		try {
			let { data } = await triggerSignUp(body)
			if (data) {
				dispatch(setToken(data.accessToken))
			} else {
				toastError()
			}
		} catch {
			toastError()
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
