import classNames from 'classnames'
import React from 'react'
import Spinner from '../Spinner/Spinner'
import styles from './GitHubAuth.module.scss'

export default function LoginGitHub({
	className,
	children,
	spinner = false,
	redirect = 'http://localhost:3000/login',
	...props
}) {
	const CLIENT_ID = 'Iv1.13f680a0cf5688c2'

	const url =
		'https://github.com/login/oauth/authorize?' +
		new URLSearchParams({
			client_id: CLIENT_ID,
			scope: ['read:user', 'user:email'].join(' '),
			redirect_uri: redirect,
		})

	return (
		<a
			className={classNames(className || '', styles.Link)}
			href={!props.disabled ? url : '##'}
			{...props}
		>
			{spinner && <Spinner />}
			{children || 'Sign up with GitHub'}
		</a>
	)
}
