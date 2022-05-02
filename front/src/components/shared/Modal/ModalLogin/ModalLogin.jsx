import React, { useState } from 'react'
import GitHubAuth from '../../AuthService/GitHubAuth'
import GoogleAuth from '../../AuthService/GoogleAuth'
import Modal from '../Modal'
import styles from './ModalLogin.module.scss'

export default function ModalLogin({ isOpen, setOpen }) {
	const [login, setLogin] = useState('')

	return (
		<Modal isOpen={isOpen} setOpen={setOpen} className={styles.Modal}>
			<Modal.Logo />
			<Modal.Close />
			<GoogleAuth className={styles.Auth}>Sign in with Google</GoogleAuth>
			<GitHubAuth className={styles.Auth} redirect="/login/github">
				Sign in with Github
			</GitHubAuth>
			<Modal.Description></Modal.Description>
			<Modal.Separator>Or</Modal.Separator>
			<Modal.Input
				placeholder="Username or login"
				value={login}
				onChange={(e) => setLogin(e.target.value)}
			></Modal.Input>
			<Modal.Button>Continue</Modal.Button>
		</Modal>
	)
}
