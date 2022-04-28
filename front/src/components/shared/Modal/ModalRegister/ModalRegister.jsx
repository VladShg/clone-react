import React, { useEffect, useState } from 'react'
import { useValidateProfileQuery } from '../../../../services/authApi'
import Modal from '../Modal'

export default function ModalRegister({ isOpen, setOpen, profile }) {
	let [name, setName] = useState('')
	let [email, setEmail] = useState('')
	let [date, setDate] = useState(null)

	// Fetch if email is not empty
	let { data, isLoading, isFetching } = useValidateProfileQuery(
		{ email: email },
		{ skip: !email }
	)

	useEffect(() => {
		if (!isOpen) {
			setName('')
			setEmail('')
			setDate(null)
		}
	})

	useEffect(() => {
		if (profile) {
			setName(profile.name)
			setEmail(profile.email)
		}
	}, [profile])

	const isNotValidEmail = !isFetching && !isLoading && data && !data.isAvailable
	const isNextDisabled = !date || !email || !name || isNotValidEmail

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
					onChange={(e) => setName(e.target.value)}
					placeholder="Name"
					type="text"
				/>

				<Modal.Input
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/>
				<Modal.Button disabled={isNextDisabled} type="submit">
					Next
				</Modal.Button>
			</form>
		</Modal>
	)
}
