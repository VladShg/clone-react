import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useLazyLoginQuery } from '../../../../services/authApi'
import { setToken } from '../../../../store/auth/authSlice'
import Modal, { ModalBody, ModalField, ModalSubmit } from '../Modal'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { Stack, Typography } from '@mui/material'

const schema = yup
	.object({
		password: yup.string().required(),
	})
	.required()

export const PasswordWindow = function ({ login, setLogin }) {
	const [triggerLogin, { isLoading }] = useLazyLoginQuery()
	const dispatch = useDispatch()
	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
	})

	const onLogin = async (input) => {
		const { data, isError } = await triggerLogin({
			login,
			password: input.password,
		})
		if (!isError) {
			dispatch(setToken(data.accessToken))
		} else {
			toast.error('Wrong credentians', { position: 'bottom-center' })
		}
	}

	return (
		<ModalBody>
			<Stack
				direction="column"
				gap="20px"
				component="form"
				onSubmit={handleSubmit(onLogin)}
			>
				<Modal.Back
					onClick={() => setLogin((prev) => ({ ...prev, isOpen: false }))}
				/>
				<Typography variant="modalSub">Username or login</Typography>
				<ModalField fullWidth value={login} variant="filled" disabled />
				<Typography variant="modalSub">Password</Typography>
				<ModalField
					fullWidth
					type="password"
					placeholder="Password"
					{...register('password')}
				/>
				<ModalSubmit type="submit" disabled={isLoading || !isValid}>
					Submit
				</ModalSubmit>
			</Stack>
		</ModalBody>
	)
}
