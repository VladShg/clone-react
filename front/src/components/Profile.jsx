import React from 'react'
import { useSelector } from 'react-redux'
import { authSelector } from '../store/auth/authSlice'
import { ProfileStyles as styles } from '../styles/_Styles'
import Avatar from './shared/Avatar/Avatar'

export default function Profile() {
	const { user } = useSelector(authSelector)
	const { name, username, avatar } = user
	return (
		<div className={styles.container}>
			<Avatar src={avatar} />
			<div className={styles.description}>
				<span>{name}</span>
				<span className={styles.username}>{'@' + username}</span>
			</div>
		</div>
	)
}
