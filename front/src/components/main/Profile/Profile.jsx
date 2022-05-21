import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import { useGetAvatarQuery, useGetUserQuery } from '../../../services/userApi'
import styles from './Profile.module.scss'
import Spinner from '../../shared/Spinner/Spinner'
import Avatar from '../../shared/Avatar/Avatar'
import classNames from 'classnames'

export default function Profile() {
	const username = useParams().username
	const { data: profile, isLoading } = useGetUserQuery(username)
	const { data: avatar, isLoading: isAvatarLoading } =
		useGetAvatarQuery(username)

	if (isLoading || !profile || isAvatarLoading) {
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
				<Avatar className={styles.Avatar} src={avatar} size="130" />
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
