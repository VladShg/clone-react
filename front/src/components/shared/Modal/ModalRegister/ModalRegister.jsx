import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useValidateProfileQuery } from '../../../../services/authApi'
import {
	registerSelector,
	updateProfile,
} from '../../../../store/auth/registerSlice'
import Modal from '../Modal'

export default function ModalRegister({ isOpen, setOpen }) {
	const { name, email, birth } = useSelector(registerSelector).profile
	const dispatch = useDispatch()

	// Fetch if email is not empty
	let { data, isLoading, isFetching } = useValidateProfileQuery(
		{ email: email },
		{ skip: !email }
	)

	useEffect(() => {
		if (!isOpen) {
			dispatch(updateProfile({ name: '', email: '', birth: '', username: '' }))
		}
	}, [isOpen])

	const isNotValidEmail = !isFetching && !isLoading && data && !data.isAvailable
	const isNextDisabled = !birth || !email || !name || isNotValidEmail

	return (
		<Modal isOpen={isOpen} setOpen={setOpen}>
			<form
				onSubmit={(e) => {
					e.preventDefault()
				}}
			>
				<Modal.Logo />
				<Modal.Close />
				<Modal.Title>Create your account</Modal.Title>
				<Modal.Input
					required
					value={name}
					onChange={(e) => dispatch(updateProfile({ name: e.target.value }))}
					placeholder="Name"
					type="text"
				/>

				<Modal.Input
					required
					value={email}
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
					onChange={(e) => dispatch(updateProfile({ birth: e.target.value }))}
				/>
				<Modal.Button disabled={isNextDisabled} type="submit">
					Next
				</Modal.Button>
			</form>
		</Modal>
	)
}
