import React, { useEffect } from 'react'
import styles from './Login.module.scss'
import backgroundImage from '../../media/background/painted.png'
import classNames from 'classnames'
import {
	useLazyGitHubConnectQuery,
	useLazyGitHubLoginQuery,
	useLazyGoogleConnectQuery,
	useLazyGoogleLoginQuery,
} from './../../services/authApi'
import { useSearchParams } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import ModalRegister from '../../components/shared/Modal/ModalRegister/ModalRegister'
import { useDispatch, useSelector } from 'react-redux'
import {
	registerSelector,
	setRegisterModal,
	setLoginModal,
	closeRegisterModal,
	loadProfile,
} from '../../store/auth/registerSlice'
import LoginGitHub from '../../components/shared/LoginGitHub/LoginGitHub'
import config from '../../config'
import ModalLogin from '../../components/shared/Modal/ModalLogin/ModalLogin'
import { setToken } from '../../store/auth/authSlice'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
	const [triggerGoogleLogin] = useLazyGoogleLoginQuery()
	const [triggerGithubLogin] = useLazyGitHubLoginQuery()
	const [triggerGoogleConnect] = useLazyGoogleConnectQuery()
	const [triggerGitHubConnect, gitHubResponse] = useLazyGitHubConnectQuery()
	const [params, setSearchParams] = useSearchParams()
	const { isRegisterModalOpen, isLoginModalOpen } =
		useSelector(registerSelector)
	const dispatch = useDispatch()

	let inputDisabled = gitHubResponse.isLoading || gitHubResponse.isFetching
	let isGitHubLoading = gitHubResponse.isLoading || gitHubResponse.isFetching

	useEffect(async () => {
		if (params.has('code')) {
			setSearchParams(new URLSearchParams())
			const code = params.get('code')
			let { data, error, isSuccess } = await triggerGitHubConnect(code)
			console.log(data, error, isSuccess)
			if (isSuccess) {
				let profile = { ...data }
				profile.gitHubId = data.githubId
				delete profile.githubId
				console.log(profile, data)
				dispatch(loadProfile({ ...profile }))
			} else if (error.status === 409) {
				toast.error('Account already exist, please login instead', {
					position: 'bottom-center',
				})
			}
		}
	}, [])

	const onSignUp = async (googleResponse) => {
		const token = googleResponse.accessToken
		let { error, isSuccess } = await triggerGoogleConnect(token)
		if (isSuccess) {
			const profileObj = googleResponse.profileObj
			let name = [profileObj.name]
			if (profileObj.familyName) {
				name.push(profileObj.familyName)
			}
			dispatch(
				loadProfile({
					name: name.join(' '),
					email: profileObj.email,
					googleId: profileObj.googleId,
				})
			)
		} else if (error.status === 409) {
			toast.error('Account already exist, please login instead', {
				position: 'bottom-center',
			})
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
					<button
						className={styles.signupManual}
						onClick={() => {
							dispatch(setRegisterModal(true))
						}}
					>
						Sign up with email
					</button>
					<span className={styles.termsNotice}>
						By signing up, you agree to the Terms of Service and Privacy Policy,
						including Cookie Use.
					</span>
					<h3>Already have an account?</h3>
					<button
						className={styles.signIn}
						onClick={() => dispatch(setLoginModal(true))}
					>
						Sign in
					</button>
					<ModalRegister
						isOpen={isRegisterModalOpen}
						setOpen={(value) => {
							if (!value) {
								dispatch(closeRegisterModal())
							} else {
								dispatch(setRegisterModal(value))
							}
						}}
					/>
					<ModalLogin
						isOpen={isLoginModalOpen}
						setOpen={(value) => dispatch(setLoginModal(value))}
					></ModalLogin>
				</div>
			</div>
			<Toaster />
		</div>
	)
}
