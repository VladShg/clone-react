import React, { useEffect } from 'react'
import styles from './Login.module.scss'
import backgroundImage from '../../media/background/painted.png'
import classNames from 'classnames'
import {
	useLazyGitHubConnectQuery,
	useLazyGoogleConnectQuery,
} from './../../services/authApi'
import { Link, useSearchParams } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import ModalRegister from '../../components/shared/Modal/ModalRegister/ModalRegister'
import { useDispatch, useSelector } from 'react-redux'
import {
	registerSelector,
	setModal,
	loadProfile,
} from '../../store/auth/registerSlice'
import LoginGitHub from '../../components/shared/LoginGitHub/LoginGitHub'
import config from '../../config'

export default function Login() {
	const [triggerGoogleConnect] = useLazyGoogleConnectQuery()
	const [triggerGitHubConnect, gitHubResponse] = useLazyGitHubConnectQuery()
	const [params, setSearchParams] = useSearchParams()
	const { isModalOpen } = useSelector(registerSelector)
	const dispatch = useDispatch()

	let inputDisabled = gitHubResponse.isLoading || gitHubResponse.isFetching
	let isGitHubLoading = gitHubResponse.isLoading || gitHubResponse.isFetching

	useEffect(async () => {
		if (params.has('code')) {
			setSearchParams(new URLSearchParams())
			const code = params.get('code')
			let response = await triggerGitHubConnect(code)
			let profile = response.data

			dispatch(loadProfile({ ...profile }))
		}
	}, [])

	const onSignUp = async (googleResponse) => {
		const token = googleResponse.accessToken
		let connectToken = await triggerGoogleConnect(token)
		if (connectToken.isSuccess) {
			const profileObj = googleResponse.profileObj
			let name = [profileObj.name]
			if (profileObj.familyName) {
				name.push(profileObj.familyName)
			}
			dispatch(loadProfile({ name: name.join(' '), email: profileObj.email }))
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
						clientId={config.google.CLIENT_ID}
						render={(renderProps) => (
							<button
								className={styles.signupService}
								onClick={renderProps.onClick}
								disabled={renderProps.disabled || inputDisabled}
							>
								Sign up with Google
							</button>
						)}
						cookiePolicy={'single_host_origin'}
						onSuccess={onSignUp}
					/>
					<LoginGitHub
						spinner={isGitHubLoading}
						className={styles.signupService}
						disabled={inputDisabled}
					/>
					<span className={styles.separator}>or</span>
					<Link
						to={!inputDisabled ? '/signup' : '##'}
						className={styles.signupManual}
					>
						Sign up with phone or email
					</Link>
					<span className={styles.termsNotice}>
						By signing up, you agree to the Terms of Service and Privacy Policy,
						including Cookie Use.
					</span>
					<h3>Already have an account?</h3>
					<Link
						to={!inputDisabled ? '/signup' : '##'}
						className={styles.signIn}
					>
						Sign in
					</Link>
					<ModalRegister
						isOpen={isModalOpen}
						setOpen={(value) => dispatch(setModal(value))}
					/>
				</div>
			</div>
		</div>
	)
}
