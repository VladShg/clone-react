import React from 'react'
import { AuthButton } from './AuthButton'
import config from '../../../config'

export default function GitHubAuth({
	children = 'Sign up with GitHub',
	loading = false,
	redirect = `/auth/login`,
	...props
}) {
	const CLIENT_ID = 'Iv1.13f680a0cf5688c2'

	const url =
		'https://github.com/login/oauth/authorize?' +
		new URLSearchParams({
			client_id: CLIENT_ID,
			scope: ['read:user', 'user:email'].join(' '),
			redirect_uri: config.SITE_URL + redirect,
		})

	return (
		<AuthButton loading={loading} href={!props.disabled ? url : '##'}>
			{children}
		</AuthButton>
	)
}
