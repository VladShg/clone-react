import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useLazyGoogleLoginQuery } from '@services/authApi'
import { setToken } from '@store/auth/authSlice'
import GitHubAuth from '../../AuthControl/GitHubAuth'
import GoogleAuth from '../../AuthControl/GoogleAuth'
import { PasswordWindow } from './PasswordWindow'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Modal, Grid, Divider, Stack } from '@mui/material'
import { SubtleLogo } from '@shared/Logo/Logo'
import { ModalBody, ModalField, ModalSubmit } from '../Modal'

const schema = yup
	.object({
		login: yup.string().required('Field should not be empty'),
	})
	.required()

export default function ModalLogin({ isOpen, setOpen }) {
	const [login, setLogin] = useState({ isOpen: false, value: '' })
	const [triggerGooogleLogin] = useLazyGoogleLoginQuery()
	const dispatch = useDispatch()

	const {
		register,
		handleSubmit,

		reset,
		formState: { isValid, errors },
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
	})

	useEffect(() => {
		if (!isOpen) {
			reset()
			setLogin({ isOpen: false, value: '' })
		}
		return () => {}
	}, [isOpen])

	const onLogin = async (googleResponse) => {
		const token = googleResponse.accessToken
		let { data, isSuccess } = await triggerGooogleLogin(token)
		if (isSuccess) {
			dispatch(setToken(data.accessToken))
		} else {
			toast.error('Failed to login', {
				position: 'bottom-center',
			})
		}
	}

	const onSubmit = (data) => {
		setLogin({ isOpen: true, value: data.login })
	}

	const body = (
		<ModalBody>
			<Grid container justifyContent="center">
				<SubtleLogo icon="crow" />
			</Grid>
			<GoogleAuth onSignUp={onLogin}>Sign in with Google</GoogleAuth>
			<GitHubAuth redirect="/auth/login/github">Sign in with Github</GitHubAuth>
			<Divider>or</Divider>
			<Stack
				component="form"
				direction="column"
				gap="20px"
				onSubmit={handleSubmit(onSubmit)}
			>
				<ModalField
					fullWidth
					error={errors?.login?.message}
					label={errors?.login?.message}
					placeholder="Username or login"
					{...register('login')}
				></ModalField>
				<ModalSubmit type="submit" disabled={!isValid}>
					Continue
				</ModalSubmit>
			</Stack>
		</ModalBody>
	)

	return (
		<Modal open={isOpen} onClose={() => setOpen(false)}>
			{login.isOpen ? (
				<PasswordWindow setLogin={setLogin} login={login.value} />
			) : (
				body
			)}
		</Modal>
	)
}
