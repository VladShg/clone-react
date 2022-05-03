import classNames from 'classnames'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import {
	useLazyGoogleLoginQuery,
	useLazyLoginQuery,
} from '../../../../services/authApi'
import { setToken } from '../../../../store/auth/authSlice'
import GitHubAuth from '../../AuthService/GitHubAuth'
import GoogleAuth from '../../AuthService/GoogleAuth'
import Modal from '../Modal'
import styles from './ModalLogin.module.scss'
import { PasswordWindow } from './PasswordWindow'

export default function ModalLogin({ isOpen, setOpen }) {
	const [isPasswordOpen, setPasswordOpen] = useState(false)
	const [login, setLogin] = useState('')
	const [triggerGooogleLogin] = useLazyGoogleLoginQuery()
	const dispatch = useDispatch()

	const onSignUp = async (googleResponse) => {
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

	const openPasswordWindow = (e) => {
		e.preventDefault()
		setPasswordOpen(true)
	}

	return (
		<Modal isOpen={isOpen} setOpen={setOpen} className={styles.Modal}>
			{isPasswordOpen && (
				<PasswordWindow setOpen={setPasswordOpen} login={login} />
			)}
			<Modal.Logo />
			<Modal.Close />
			<GoogleAuth className={styles.Auth} onSignUp={onSignUp}>
				Sign in with Google
			</GoogleAuth>
			<GitHubAuth className={styles.Auth} redirect="/login/github">
				Sign in with Github
			</GitHubAuth>
			<Modal.Description></Modal.Description>
			<Modal.Separator>Or</Modal.Separator>
			<form onSubmit={openPasswordWindow}>
				<Modal.Input
					placeholder="Username or login"
					value={login}
					required
					onChange={(e) => setLogin(e.target.value)}
				></Modal.Input>
				<Modal.Button type="submit">Continue</Modal.Button>
			</form>
		</Modal>
	)
}
