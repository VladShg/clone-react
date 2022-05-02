import classNames from 'classnames'
import React from 'react'
import config from '../../../config'
import Spinner from '../Spinner/Spinner'
import styles from './AuthService.module.scss'

export default function GitHubAuth({
	className,
	children,
	spinner = false,
	redirect = `/login`,
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
		<a
			className={classNames(styles.Control, { [className]: !!className })}
			href={!props.disabled ? url : '##'}
			{...props}
		>
			{spinner && <Spinner />}
			{children || 'Sign up with GitHub'}
		</a>
	)
}
