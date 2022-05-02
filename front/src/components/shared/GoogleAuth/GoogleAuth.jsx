import React from 'react'
import GoogleLogin from 'react-google-login'
import config from '../../../config'

export default function GoogleAuth({ className, disabled, onSignUp }) {
	return (
		<GoogleLogin
			clientId={config.google.CLIENT_ID}
			render={(renderProps) => (
				<button
					className={className}
					onClick={renderProps.onClick}
					disabled={renderProps.disabled || disabled}
				>
					Sign up with Google
				</button>
			)}
			cookiePolicy={'single_host_origin'}
			onSuccess={onSignUp}
		/>
	)
}
