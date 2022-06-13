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
import { useUpdateUserMutation } from '@services/userApi'
import toast, { Toaster } from 'react-hot-toast'

export default function Profile() {
	const { user } = useSelector(authSelector)
	const username = useParams().username
	const [isOpen, setOpen] = useState(false)
	const toggleModal = () => setOpen(!isOpen)
	const { user: profile, isLoading } = useProfile(username)
	const [triggerUpdate] = useUpdateUserMutation()

	const updateProfile = async (body) => {
		let { error } = await triggerUpdate({ username, body })
		if (!error) {
			toast.success('Profile updated', { position: 'bottom-center' })
		} else {
			toast.error('Failed to update', { position: 'bottom-center' })
		}
		setOpen(false)
	}

	if (isLoading) {
		return (
			<div className={styles.SpinnerContainer}>
				<Spinner size={100} />
			</div>
		)
	}

	const bgStyles = { backgroundImage: `url('${profile.background}')` }
	const isUser = username === user?.username

	return (
		<div>
			{isUser && (
				<ModalUpdateProfile
					update={updateProfile}
					isOpen={isOpen}
					setOpen={setOpen}
					profile={profile}
				/>
			)}
			<div style={bgStyles} className={styles.Background}></div>
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
				{profile.bio && <div className={styles.Bio}>{profile.bio}</div>}
				<div className={styles.BottomRow}>
					{profile.location && (
						<span className={styles.DateLocation}>
							<i className="fas fa-search-location" /> {profile.location}
						</span>
					)}
					<span className={styles.DateLocation}>
						<i className="fa-solid fa-calendar-days" />
						Joined {new Date(profile.createdAt).toDateString()}
					</span>
				</div>
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
			<Toaster />
		</div>
	)
}
