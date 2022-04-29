import React, { useState } from 'react'
import styles from './Login.module.scss'
import backgroundImage from '../../media/background/painted.png'
import classNames from 'classnames'
import { useLazyGoogleConnectQuery } from './../../services/authApi'
import { Link } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import { CLIENT_ID } from '../../config'
import ModalRegister from '../../components/shared/Modal/ModalRegister/ModalRegister'
import { useDispatch } from 'react-redux'
import { updateProfile } from '../../store/auth/registerSlice'

export default function Login() {
	const [isModalOpen, setModalOpen] = useState(true)
	const [triggerConnect] = useLazyGoogleConnectQuery()
	const dispatch = useDispatch()

	const onSignUp = async (googleResponse) => {
		const token = googleResponse.accessToken
		let connectToken = await triggerConnect(token)
		if (connectToken.isSuccess) {
			setModalOpen(true)

			const profileObj = googleResponse.profileObj
			let name = [profileObj.name]
			if (profileObj.familyName) {
				name.push(profileObj.familyName)
			}
			dispatch(updateProfile({ name: name.join(' '), email: profileObj.email }))
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.background}>
				<i className={classNames('fa-solid fa-crow', styles.backgroundLogo)} />
				<img src={backgroundImage} alt="wall" />
			</div>
			<div>
				<div className={styles.loginContainer}>
					<i className={classNames('fa-solid fa-crow', styles.logo)} />
					<h1>Happening now</h1>
					<h2>Join Crower today.</h2>
					<GoogleLogin
						clientId={CLIENT_ID}
						render={(renderProps) => (
							<button
								className={styles.signupService}
								onClick={renderProps.onClick}
								disabled={renderProps.disabled}
							>
								Sign up with Google
							</button>
						)}
						cookiePolicy={'single_host_origin'}
						onSuccess={onSignUp}
					/>
					<Link to="/signup" className={styles.signupService}>
						Sign up with Apple
					</Link>
					<span className={styles.separator}>or</span>
					<Link to="/signup" className={styles.signupManual}>
						Sign up with phone or email
					</Link>
					<span className={styles.termsNotice}>
						By signing up, you agree to the Terms of Service and Privacy Policy,
						including Cookie Use.
					</span>
					<h3>Already have an account?</h3>
					<Link to="/signup" className={styles.signIn}>
						Sign in
					</Link>
					<ModalRegister isOpen={isModalOpen} setOpen={setModalOpen} />
				</div>
			</div>
		</div>
	)
}
