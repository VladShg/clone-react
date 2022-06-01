import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useLazyLoginQuery } from '@services/authApi'
import { setToken } from '@store/auth/authSlice'
import { ModalControl, ModalField, ModalSubmit } from '../Modal'
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
		control,
		handleSubmit,
		formState: { isValid },
	} = useForm({
		defaultValues: { password: '' },
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
		<Stack
			direction="column"
			gap="20px"
			component="form"
			onSubmit={handleSubmit(onLogin)}
		>
			<ModalControl
				icon="arrow-left"
				onClick={() => setLogin((prev) => ({ ...prev, isOpen: false }))}
			/>
			<Typography variant="modalSub">Username or login</Typography>
			<ModalField value={login} fullWidth variant="filled" disabled />
			<Typography variant="modalSub">Password</Typography>
			<Controller
				name="password"
				control={control}
				render={({ field: { value, onChange }, fieldState: { error } }) => (
					<ModalField
						type="password"
						value={value}
						onChange={onChange}
						error={!!error?.message}
						label={error?.message}
						placeholder="Password"
						fullWidth
					/>
				)}
			/>
			<ModalSubmit type="submit" disabled={isLoading || !isValid}>
				Submit
			</ModalSubmit>
		</Stack>
	)
}
