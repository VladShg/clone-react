import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { previousStep, registerSelector } from '@store/auth/registerSlice'
import Modal from '../../Modal'
import { useLazySignUpQuery } from '@services/authApi'
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
	const [triggerSignUp] = useLazySignUpQuery()
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
		let body = new FormData()
		for (let key of Object.keys(profile)) {
			body.append(key, profile[key])
		}
		body.append('avatar', image)
		let { data, isSuccess } = await triggerSignUp(body)
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
