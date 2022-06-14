import React, { useState } from 'react'
import isPropValid from '@emotion/is-prop-valid'
import { Outlet, useParams } from 'react-router-dom'
import Spinner from '@shared/Spinner/Spinner'
import Avatar from '@shared/Avatar/Avatar'
import useProfile from '@hooks/useProfile'
import { useSelector } from 'react-redux'
import { authSelector } from '@store/auth/authSlice'
import ModalUpdateProfile from './components/ModalUpdateProfile'
import { useUpdateUserMutation } from '@services/userApi'
import toast, { Toaster } from 'react-hot-toast'
import { SpinnerContainer } from './components/SpinnerContainer'
import { Stack, styled } from '@mui/material'
import { LightButton } from '@shared/Button/Button'
import ProfileTabs from './components/ProfileTabs'

const ProfileWrapper = styled('div')(() => ({
	position: 'relative',
	marginTop: '-75px',
	padding: '0px 10px',
	display: 'flex',
	flexDirection: 'column',
	gap: '20px',
	marginBottom: '20px',
}))

const AvatarWrapper = styled(Stack)(({ theme }) => ({
	'> * > div': { border: `3px solid ${theme.palette.common.white}` },
}))

const Background = styled('div', { shouldForwardProp: isPropValid })(
	({ theme, image }) => ({
		height: '200px',
		width: '100%',
		backgroundColor: theme.palette.common.bgGrey,
		backgroundImage: image ? `url('${image}')` : '',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		objectFit: 'cover',
	})
)

const DateLocation = styled('span')(({ theme }) => ({
	color: theme.palette.common.dark,
	svg: { marginRight: '5px' },
}))

const Name = styled('span')(() => ({
	fontWeight: 'bold',
	display: 'block',
}))

const Username = styled('span')(({ theme }) => ({
	color: theme.palette.common.dark,
	fontWeight: 'normal',
	display: 'block',
}))

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
			<SpinnerContainer>
				<Spinner size={100} />
			</SpinnerContainer>
		)
	}

	const isUser = username === user?.username

	return (
		<Stack sx={{ minHeight: '100%' }}>
			{isUser && (
				<ModalUpdateProfile
					update={updateProfile}
					isOpen={isOpen}
					setOpen={setOpen}
					profile={profile}
				/>
			)}
			<Background image={profile.background} />
			<ProfileWrapper>
				<AvatarWrapper
					direction="row"
					justifyContent="space-between"
					alignItems="flex-end"
				>
					<Avatar src={profile.avatar} size="130" />
					{isUser && (
						<LightButton onClick={toggleModal}>Edit profile</LightButton>
					)}
				</AvatarWrapper>
				<div>
					<Name>{profile.name}</Name>
					<Username>@{profile.username}</Username>
				</div>
				{profile.bio && <div>{profile.bio}</div>}
				<Stack gap="20px" direction="row">
					{profile.location && (
						<DateLocation>
							<i className="fas fa-search-location" /> {profile.location}
						</DateLocation>
					)}
					<DateLocation>
						<i className="fa-solid fa-calendar-days" />
						Joined {new Date(profile.createdAt).toDateString()}
					</DateLocation>
				</Stack>
			</ProfileWrapper>
			<ProfileTabs profile={profile} />
			<Outlet />
			<Toaster />
		</Stack>
	)
}
