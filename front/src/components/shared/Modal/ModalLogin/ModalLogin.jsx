import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useLazyGoogleLoginQuery } from '../../../../services/authApi'
import { setToken } from '../../../../store/auth/authSlice'
import GitHubAuth from '../../AuthService/GitHubAuth'
import GoogleAuth from '../../AuthService/GoogleAuth'
import Modal from '../Modal'
import styles from './ModalLogin.module.scss'
import { PasswordWindow } from './PasswordWindow'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup
	.object({
		login: yup.string().required(),
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
		formState: { isValid },
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

	return (
		<Modal isOpen={isOpen} setOpen={setOpen} className={styles.Modal}>
			{login.isOpen && (
				<PasswordWindow setLogin={setLogin} login={login.value} />
			)}
			<Modal.Logo />
			<Modal.Close />
			<GoogleAuth className={styles.Auth} onSignUp={onLogin}>
				Sign in with Google
			</GoogleAuth>
			<GitHubAuth className={styles.Auth} redirect="/auth/login/github">
				Sign in with Github
			</GitHubAuth>
			<Modal.Description></Modal.Description>
			<Modal.Separator>Or</Modal.Separator>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Input
					placeholder="Username or login"
					props={register('login')}
				></Modal.Input>
				<Modal.Button type="submit" disabled={!isValid}>
					Continue
				</Modal.Button>
			</form>
		</Modal>
	)
}
