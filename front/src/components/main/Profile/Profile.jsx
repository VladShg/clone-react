import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import { useGetUserQuery } from '../../../services/userApi'
import styles from './Profile.module.scss'
import Spinner from '../../shared/Spinner/Spinner'
import Avatar from '../../shared/Avatar/Avatar'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { authSelector } from '../../../store/auth/authSlice'

export default function Profile() {
	const { user } = useSelector(authSelector)
	const username = useParams().username || user?.username
	const { data: profile, isLoading } = useGetUserQuery(username)

	if (isLoading || !profile) {
		return (
			<div className={styles.SpinnerContainer}>
				<Spinner className={styles.Spinner} />
			</div>
		)
	}

	return (
		<div>
			<div className={styles.Background}></div>
			<div className={styles.Profile}>
				<Avatar className={styles.Avatar} src="" size="130" />
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
				<NavLink
					className={({ isActive }) => {
						return classNames(styles.Tab, { [styles.ActiveTab]: isActive })
					}}
					end
					to={`/profile/${profile.username}`}
				>
					Tweets
				</NavLink>
				<NavLink
					className={({ isActive }) => {
						return classNames(styles.Tab, { [styles.ActiveTab]: isActive })
					}}
					to={`/profile/${profile.username}/replies`}
				>
					Tweets & replies
				</NavLink>
				<NavLink
					className={({ isActive }) => {
						return classNames(styles.Tab, { [styles.ActiveTab]: isActive })
					}}
					to={`/profile/${profile.username}/likes`}
				>
					Likes
				</NavLink>
			</div>
			<Outlet />
		</div>
	)
}
