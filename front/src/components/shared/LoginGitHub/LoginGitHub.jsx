import classNames from 'classnames'
import React from 'react'
import { SpinnerCircular } from 'spinners-react'
import styles from './LoginGitHub.module.scss'

export default function LoginGitHub({
	className,
	children,
	spinner = false,
	...props
}) {
	const CLIENT_ID = 'Iv1.13f680a0cf5688c2'

	const url =
		'https://github.com/login/oauth/authorize?' +
		new URLSearchParams({
			client_id: CLIENT_ID,
			scope: ['read:user', 'user:email'].join(' '),
			redirect_uri: 'http://localhost:3000/login',
		})

	return (
		<a
			className={classNames(className || '', styles.Link)}
			href={!props.disabled ? url : '##'}
			{...props}
		>
			{spinner && <SpinnerCircular className={styles.Spinner} />}
			{children || 'Sign up with GitHub'}
		</a>
	)
}
