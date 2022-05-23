import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import styles from './Profile.module.scss'
import Spinner from '@shared/Spinner/Spinner'
import Avatar from '@shared/Avatar/Avatar'
import classNames from 'classnames'
import useProfile from '@hooks/useProfile'

export default function Profile() {
	const username = useParams().username
	const { user: profile, isLoading } = useProfile(username)

	if (isLoading) {
		return (
			<div className={styles.SpinnerContainer}>
				<Spinner className={styles.Spinner} />
			</div>
		)
	}

	function ProfileLink({ children, ...props }) {
		return (
			<NavLink
				className={({ isActive }) => {
					return classNames(styles.Tab, { [styles.ActiveTab]: isActive })
				}}
				{...props}
			>
				{children}
			</NavLink>
		)
	}

	return (
		<div>
			<div className={styles.Background}></div>
			<div className={styles.Profile}>
				<Avatar className={styles.Avatar} src={profile.avatar} size="130" />
				<div>
					<span className={styles.Name}>{profile.name}</span>
					<span className={styles.Username}>@{profile.username}</span>
				</div>
				{profile.description && <span>{profile.description}</span>}
				<span className={styles.JoinDate}>
					<i className="fa-solid fa-calendar-days" />
					Joined {new Date(profile.createdAt).toDateString()}
				</span>
			</div>
			<div className={styles.Tabs}>
				<ProfileLink end to={`/profile/${profile.username}`}>
					Tweets
				</ProfileLink>
				<ProfileLink to={`/profile/${profile.username}/replies`}>
					Tweets & replies
				</ProfileLink>
				<ProfileLink to={`/profile/${profile.username}/likes`}>
					Likes
				</ProfileLink>
			</div>
			<Outlet />
		</div>
	)
}
