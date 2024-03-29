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
import Modal from '../../Modal'
import { validateEmail } from '@utils/api'

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

export default function InitialStep() {
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
		<form onSubmit={handleSubmit(onSubmit)}>
			<Modal.Logo />
			<Modal.Close />
			<Modal.Title>Create your account</Modal.Title>
			<Modal.Input
				props={register('name')}
				defaultValue={profile.name}
				placeholder="Name"
			/>
			<Modal.Warning>{errors.name?.message}</Modal.Warning>
			<Modal.Input
				props={register('email')}
				defaultValue={profile.email}
				placeholder="Email"
			/>
			<Modal.Warning>{errors.email?.message}</Modal.Warning>
			<Modal.SubTitle>Date of birth</Modal.SubTitle>
			<Modal.Description>
				This will not be shown publicly. Confirm your own age, even if this
				account is for a business, a pet, or something else.
			</Modal.Description>
			<Modal.DatePicker
				props={register('birth')}
				defaultValue={profile.birth ? profile.birth.slice(0, 10) : ''}
			/>
			<Modal.Warning>{errors.birth?.message}</Modal.Warning>
			<Modal.Button disabled={!isValid} type="submit">
				Next
			</Modal.Button>
		</form>
	)
}
