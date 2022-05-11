import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, logout } from '../../../store/auth/authSlice'
import styles from './Account.module.scss'
import Avatar from '../Avatar/Avatar'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

export default function Account() {
	const { user } = useSelector(authSelector)
	const { name, username, avatar } = user || {}
	const [menuOpen, setMenuOpen] = useState(false)
	const dispatch = useDispatch()

	if (!user) {
		return null
	}

	function Container({ children, className, ...props }) {
		return (
			<div
				className={classNames(styles.Container, { [className]: !!className })}
				{...props}
			>
				{children}
			</div>
		)
	}

	function Descryption({ children }) {
		return <div className={styles.Description}>{children}</div>
	}

	function Name({ name }) {
		return <span>{name}</span>
	}

	function Username({ username }) {
		return <span className={styles.Username}>{'@' + username}</span>
	}

	return (
		<div className={styles.Wrapper}>
			<div className={classNames(styles.DropDown, { [styles.Open]: menuOpen })}>
				<Container className={styles.InnerContainer}>
					<Avatar src={avatar} />
					<Descryption>
						<Name name={name} />
						<Username username={username} />
					</Descryption>
				</Container>
				<Link className={styles.Item} to={`/profile/${user.username}`}>
					Edit profile
				</Link>
				<button className={styles.Item} onClick={() => dispatch(logout())}>
					Log out from @{username}
				</button>
			</div>
			<Container onClick={() => setMenuOpen(!menuOpen)}>
				<Avatar src={avatar} />
				<Descryption>
					<div className={styles.Icon}>
						<i className="fa-solid fa-ellipsis"></i>
					</div>
					<Name name={name} />
					<Username username={username} />
				</Descryption>
			</Container>
		</div>
	)
}
