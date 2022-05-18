import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useLazyLoginQuery } from '../../../../services/authApi'
import { setToken } from '../../../../store/auth/authSlice'
import Modal from '../Modal'
import styles from './ModalLogin.module.scss'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

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

	const onLogin = async (data) => {
		const { response, isSuccess } = await triggerLogin({
			login,
			password: data.password,
		})
		if (isSuccess) {
			dispatch(setToken(response.accessToken))
		} else {
			toast.error('Wrong credentians', { position: 'bottom-center' })
		}
	}

	return (
		<div className={styles.PasswordContainer}>
			<form onSubmit={handleSubmit(onLogin)}>
				<div className={styles.PasswordModal}>
					<Modal.Back
						onClick={() => setLogin((prev) => ({ ...prev, isOpen: false }))}
					/>
					<div className={styles.InputContainer}>
						<Modal.SubTitle>Username or login</Modal.SubTitle>
						<Modal.Input value={login} disabled />
						<Modal.SubTitle>Password</Modal.SubTitle>
						<Modal.Input
							type="password"
							placeholder="Password"
							props={register('password')}
						/>
					</div>
					<div className={styles.SubmitContainer}>
						<Modal.Button type="submit" disabled={isLoading || !isValid}>
							Submit
						</Modal.Button>
					</div>
				</div>
			</form>
		</div>
	)
}
