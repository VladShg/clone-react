import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { previousStep, registerSelector } from '@store/auth/registerSlice'
import { useSignUpMutation } from '@services/authApi'
import { setToken } from '@store/auth/authSlice'
import toast from 'react-hot-toast'
import {
	ModalControl,
	ModalField,
	ModalLogo,
	ModalSubmit,
} from '@shared/Modal/Modal'
import { Stack, Typography } from '@mui/material'

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
		<Stack
			onSubmit={handleSubmit(onSubmit)}
			component="form"
			direction="column"
			gap="20px"
		>
			<ModalControl
				icon="arrow-left"
				onClick={() => dispatch(previousStep())}
			/>
			<ModalLogo />
			<Typography variant="modalTitle">Enter password</Typography>
			<ModalField
				placeholder="Password"
				type="password"
				error={errors.password?.message}
				label={errors.password?.message}
				{...register('password')}
				fullWidth
			/>
			<ModalField
				placeholder="Confirm password"
				type="password"
				error={errors.confirm?.message}
				label={errors.confirm?.message}
				{...register('confirm')}
				fullWidth
			/>
			<ModalSubmit type="submit" disabled={!isValid}>
				Submit
			</ModalSubmit>
			{(googleId || gitHubId) && (
				<ModalSubmit type="submit" onClick={skipPassword}>
					Skip
				</ModalSubmit>
			)}
		</Stack>
	)
}
