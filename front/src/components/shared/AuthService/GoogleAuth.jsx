import React from 'react'
import classNames from 'classnames'
import GoogleLogin from 'react-google-login'
import config from '../../../config'
import styles from './AuthService.module.scss'

export default function GoogleAuth({ className, disabled, onSignUp, children }) {
	return (
		<GoogleLogin
			clientId={config.google.CLIENT_ID}
			render={(renderProps) => (
				<button
					className={classNames(styles.Control, { [className]: !!className })}
					onClick={renderProps.onClick}
					disabled={renderProps.disabled || disabled}
				>
					{children || 'Sign up with Google'}
				</button>
			)}
			cookiePolicy={'single_host_origin'}
			onSuccess={onSignUp}
		/>
	)
}
