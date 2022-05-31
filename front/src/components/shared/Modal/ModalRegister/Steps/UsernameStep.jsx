import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { validateUsername } from '@utils/api'
import {
	nextStep,
	previousStep,
	registerSelector,
	updateProfile,
} from '@store/auth/registerSlice'
import { Stack, Typography } from '@mui/material'
import {
	ModalControl,
	ModalField,
	ModalLogo,
	ModalSubmit,
} from '@shared/Modal/Modal'

const schema = yup
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

export default function UsernameStep() {
	const dispatch = useDispatch()
	const profile = useSelector(registerSelector).profile
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
	})

	const onSubmit = (data) => {
		dispatch(updateProfile({ username: data.username }))
		dispatch(nextStep())
	}

	return (
		<Stack
			component="form"
			direction="column"
			gap="20px"
			onSubmit={handleSubmit(onSubmit)}
		>
			<ModalControl
				icon="arrow-left"
				onClick={() => dispatch(previousStep())}
			/>
			<ModalLogo />
			<Typography variant="modalTitle">Choose a username</Typography>
			<ModalField
				{...register('username')}
				error={errors.username?.message}
				label={errors.username?.message}
				defaultValue={profile.username}
				placeholder="Username"
				fullWidth
			/>
			<ModalSubmit type="submit" disabled={!isValid}>
				Next
			</ModalSubmit>
		</Stack>
	)
}
