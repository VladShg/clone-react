import React from 'react'
import GoogleLogin from 'react-google-login'
import { AuthButton } from './AuthButton'
import config from '../../../config'

export default function GoogleAuth({
	disabled,
	onSignUp,
	children = 'Sign up with Google',
}) {
	const button = (renderProps) => (
		<AuthButton disabled={disabled} onClick={renderProps.onClick}>
			{children}
		</AuthButton>
	)

	return (
		<GoogleLogin
			clientId={config.google.CLIENT_ID}
			render={button}
			cookiePolicy={'single_host_origin'}
			onSuccess={onSignUp}
		/>
	)
}
