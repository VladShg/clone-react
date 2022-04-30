import React, { useState } from 'react'
import Modal from '../Modal'
import styles from './ModalLogin.module.scss'

export default function ModalLogin({ isOpen, setOpen }) {
	const [login, setLogin] = useState('')
	return (
		<Modal className={styles.Login} isOpen={isOpen} setOpen={setOpen}>
			<Modal.Logo />
			<Modal.Close />
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
