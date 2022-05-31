import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	nextStep,
	registerSelector,
	updateProfile,
} from '@store/auth/registerSlice'
import { validateEmail } from '@utils/api'
import {
	ModalControl,
	ModalField,
	ModalLogo,
	ModalSubmit,
} from '@shared/Modal/Modal'
import { Stack, Typography } from '@mui/material'

const schema = yup.object({
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

export default function InitialStep({ setOpen }) {
	const dispatch = useDispatch()
	const profile = useSelector(registerSelector).profile

	const {
		register,
		handleSubmit,
		formState: { isValid, errors },
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
	})

	const onSubmit = (data) => {
		let { name, email, birth } = data
		let month = ('0' + (1 + birth.getMonth())).slice(-2)
		let day = ('0' + birth.getDate()).slice(-2)
		let year = birth.getFullYear()
		birth = `${year}-${month}-${day}`
		dispatch(updateProfile({ name, email, birth }))
		dispatch(nextStep())
	}

	return (
		<Stack
			component="form"
			direction="column"
			gap="20px"
			onSubmit={handleSubmit(onSubmit)}
		>
			<ModalLogo />
			<ModalControl icon="times" onClick={() => setOpen(false)} />
			<Typography variant="modalTitle">Create your account</Typography>
			<ModalField
				{...register('name')}
				error={errors.name?.message}
				label={errors.name?.message}
				defaultValue={profile.name}
				fullWidth
				placeholder="Name"
			/>
			<ModalField
				{...register('email')}
				error={errors.email?.message}
				label={errors.email?.message}
				defaultValue={profile.email}
				fullWidth
				placeholder="Email"
			/>
			<Typography variant="modalSub">Date of birth</Typography>
			<Typography variant="modalDesc">
				This will not be shown publicly. Confirm your own age, even if this
				account is for a business, a pet, or something else.
			</Typography>
			<ModalField
				{...register('birth')}
				type="date"
				fullWidth
				error={errors.birth?.message}
				label={errors.birth?.message}
				defaultValue={profile.birth ? profile.birth.slice(0, 10) : ''}
			/>
			<ModalSubmit disabled={!isValid} type="submit">
				Next
			</ModalSubmit>
		</Stack>
	)
}
