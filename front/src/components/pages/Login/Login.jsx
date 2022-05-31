import React, { useEffect } from 'react'
import background from './assets/background.png'
import {
	useLazyGitHubConnectQuery,
	useLazyGoogleConnectQuery,
} from '@services/authApi'
import { useSearchParams } from 'react-router-dom'
import ModalRegister from '@shared/Modal/ModalRegister/ModalRegister'
import { useDispatch, useSelector } from 'react-redux'
import {
	registerSelector,
	setRegisterModal,
	setLoginModal,
	closeRegisterModal,
	loadProfile,
	resetInput,
} from '@store/auth/registerSlice'
import ModalLogin from '@shared/Modal/ModalLogin/ModalLogin'
import toast, { Toaster } from 'react-hot-toast'
import GoogleAuth from '@shared/AuthControl/GoogleAuth'
import GitHubAuth from '@shared/AuthControl/GitHubAuth'
import { BackgroundImage, LoginButton, SignUpButton } from '.'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Stack, Typography, Divider, Grid } from '@mui/material'
import { Container } from '@mui/system'
import { BackgroundLogo, SubtleLogo } from '@shared/Logo/Logo'

export default function Login() {
	const [triggerGoogleConnect, googleResponse] = useLazyGoogleConnectQuery()
	const [triggerGitHubConnect, gitHubResponse] = useLazyGitHubConnectQuery()
	const [params, setSearchParams] = useSearchParams()
	const { isRegisterModalOpen, isLoginModalOpen } =
		useSelector(registerSelector)
	const dispatch = useDispatch()

	let inputDisabled = googleResponse.isFetching
	let isGitHubLoading = gitHubResponse.isFetching

	useEffect(async () => {
		dispatch(resetInput())
		let updatedParams = new URLSearchParams(params)
		if (params.has('code')) {
			const code = params.get('code')
			let { data, error, isSuccess } = await triggerGitHubConnect(code)
			if (isSuccess) {
				let profile = { ...data }
				profile.gitHubId = data.githubId
				delete profile.githubId
				dispatch(loadProfile({ ...profile }))
			} else if (error.status === 409) {
				toast.error('Account already exist, please login instead', {
					position: 'bottom-center',
				})
			}
			updatedParams.delete('code')
			setSearchParams(new URLSearchParams(params))
		}
		if (params.has('error')) {
			toast.error(params.get('error'), {
				position: 'bottom-center',
			})
			updatedParams.delete('error')
		}
		setSearchParams(updatedParams)
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
		<Grid container gridTemplateColumns="1fr 1fr" height="100%">
			<Grid item xs={6} position="relative">
				<BackgroundLogo icon={solid('crow')} />
				<BackgroundImage src={background} alt="wall" />
			</Grid>
			<Grid item xs={6}>
				<Stack
					direction="column"
					alignItems="flex-start"
					justifyContent="center"
					gap="10px"
					sx={{ maxWidth: '300px', ml: '60px', height: '100%' }}
				>
					<SubtleLogo icon={solid('crow')} />
					<Typography variant="h1">Happening now</Typography>
					<Typography variant="h2">Join Crower today.</Typography>
					<GoogleAuth disabled={inputDisabled} onSignUp={onSignUp} />
					<GitHubAuth loading={isGitHubLoading} disabled={inputDisabled} />
					<Container disableGutters>
						<Divider sx={{ width: '100%' }}>or</Divider>
					</Container>
					<SignUpButton
						onClick={() => {
							dispatch(setRegisterModal(true))
						}}
					>
						Sign up with email
					</SignUpButton>
					<Typography variant="notice" marginBottom="40px">
						By signing up, you agree to the Terms of Service and Privacy Policy,
						including Cookie Use.
					</Typography>
					<Typography variant="h3">Already have an account?</Typography>
					<LoginButton onClick={() => dispatch(setLoginModal(true))}>
						Sign in
					</LoginButton>
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
					/>
				</Stack>
			</Grid>
			<Toaster />
		</Grid>
	)
}
