import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, logout } from '../../../store/auth/authSlice'
import styles from './Account.module.scss'
import Avatar from '../Avatar/Avatar'
import classNames from 'classnames'

function AccountSkeleton({ name, username, avatar, hasMenu = false }) {
	const [menuOpen, setMenuOpen] = useState(false)
	const dispatch = useDispatch()
	const toggleMenu = () => {
		if (hasMenu) setMenuOpen(!menuOpen)
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

	let mainContainer = classNames({ [styles.Interactive]: hasMenu })

	return (
		<div className={styles.Wrapper}>
			{hasMenu && (
				<div
					className={classNames(styles.DropDown, { [styles.Open]: menuOpen })}
				>
					<Container className={styles.InnerContainer}>
						<Avatar src={avatar} />
						<Descryption>
							<Name name={name} />
							<Username username={username} />
						</Descryption>
					</Container>
					<button
						className={styles.Item}
						onClick={() => {
							dispatch(logout())
						}}
					>
						Log out from @{username}
					</button>
				</div>
			)}
			<Container onClick={toggleMenu} className={mainContainer}>
				<Avatar src={avatar} />
				<Descryption>
					{hasMenu && (
						<div className={styles.Icon}>
							<i className="fa-solid fa-ellipsis"></i>
						</div>
					)}
					<Name name={name} />
					<Username username={username} />
				</Descryption>
			</Container>
		</div>
	)
}

export default function Account() {
	const { user } = useSelector(authSelector)
	const { name, username } = user || {}

	if (!user) {
		return null
	}

	return (
		<AccountSkeleton
			name={name}
			username={username}
			avatar={user.avatar}
			hasMenu
		/>
	)
}

export function AccountPreview({ name, username, avatar }) {
	return <AccountSkeleton name={name} username={username} avatar={avatar} />
}
