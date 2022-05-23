import React, { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import styles from './Profile.module.scss'
import Spinner from '@shared/Spinner/Spinner'
import Avatar from '@shared/Avatar/Avatar'
import useProfile from '@hooks/useProfile'
import ProfileLink from './components/ProfileLink'
import { useSelector } from 'react-redux'
import { authSelector } from '@store/auth/authSlice'
import ModalUpdateProfile from './components/ModalUpdateProfile'

export default function Profile() {
	const { user } = useSelector(authSelector)
	const username = useParams().username
	const [isOpen, setOpen] = useState(false)
	const toggleModal = () => setOpen(!isOpen)
	const { user: profile, isLoading } = useProfile(username)

	if (isLoading) {
		return (
			<div className={styles.SpinnerContainer}>
				<Spinner className={styles.Spinner} />
			</div>
		)
	}

	const isUser = username === user?.username

	return (
		<div>
			{isUser && <ModalUpdateProfile isOpen={isOpen} setOpen={setOpen} />}
			<div className={styles.Background}></div>
			<div className={styles.Profile}>
				<Avatar className={styles.Avatar} src={profile.avatar} size="130" />
				{isUser && (
					<button className={styles.Edit} onClick={toggleModal}>
						Edit profile
					</button>
				)}
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
