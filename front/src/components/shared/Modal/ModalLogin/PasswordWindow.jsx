import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLazyLoginQuery } from '../../../../services/authApi'
import { setToken } from '../../../../store/auth/authSlice'
import Modal from '../Modal'
import styles from './ModalLogin.module.scss'

export const PasswordWindow = function ({ login, setOpen }) {
	const [warning, setWarning] = useState('')
	const [password, setPassword] = useState('')
	const [triggerLogin, { isLoading }] = useLazyLoginQuery()
	const dispatch = useDispatch()

	const submitLogin = async (e) => {
		e.preventDefault()
		const { data, isSuccess } = await triggerLogin({ login, password })
		if (isSuccess) {
			dispatch(setToken(data.accessToken))
		} else {
			setWarning('Wrong credentials')
		}
	}

	return (
		<div className={styles.PasswordContainer}>
			<form onSubmit={submitLogin}>
				<div className={styles.PasswordModal}>
					<Modal.Back onClick={() => setOpen(false)} />
					<div className={styles.InputContainer}>
						<Modal.SubTitle>Username or login</Modal.SubTitle>
						<Modal.Input value={login} disabled />
						<Modal.SubTitle>Password</Modal.SubTitle>
						<Modal.Input
							value={password}
							placeholder="password"
							type="password"
							required
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Modal.Warning>{warning}</Modal.Warning>
					</div>
					<div className={styles.SubmitContainer}>
						<Modal.Button type="submit" disabled={isLoading}>
							Submit
						</Modal.Button>
					</div>
				</div>
			</form>
		</div>
	)
}
