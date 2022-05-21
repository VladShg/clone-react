import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { validateUsername } from '@utils/api'
import {
	nextStep,
	previousStep,
	updateProfile,
} from '@store/auth/registerSlice'
import Modal from '../../Modal'

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
