import React from 'react'

export default function LoginGitHub({ className, children }) {
	const CLIENT_ID = 'Iv1.13f680a0cf5688c2'

	const url =
		'https://github.com/login/oauth/authorize?' +
		new URLSearchParams({
			client_id: CLIENT_ID,
			scope: ['read:user', 'user:email'].join(' '),
			redirect_uri: 'http://localhost:3000/login',
		})

	return (
		<a className={className || ''} href={url}>
			{children || 'Sign up with GitHub'}
		</a>
	)
}
