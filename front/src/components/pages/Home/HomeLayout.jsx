import React, { useState } from 'react'
import HomeLink from '@shared/HomeLink/HomeLink'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authSelector } from '@store/auth/authSlice'
import Account from '@shared/Account/Account'
import WriteTweet from '@shared/WriteTweet/WriteTweet'
import toast, { Toaster } from 'react-hot-toast'
import { IconButton, Modal, Stack, styled } from '@mui/material'
import { ModalBody, ModalControl } from '@shared/Modal/Modal'
import { PrimaryButton } from '@shared/Button/Button'

const TitleIcon = styled(IconButton)(({ theme }) => ({
	fontSize: '32px',
	color: theme.palette.primary.main,
	'> *': {
		padding: '10px',
	},
}))

const Layout = styled('div')(() => ({
	position: 'relative',
	display: 'grid',
	minHeight: '100%',
	gridTemplateColumns: '1fr minmax(600px, 1fr) 1fr',
}))

const TweetLink = styled(Link)(({ theme }) => ({
	color: theme.palette.common.black,
}))

const Section = styled('div')(({ theme }) => ({
	maxWidth: '100%',
	'&:first-child': {
		borderRight: `1px solid ${theme.palette.common.borderGrey}`,
	},
	'&:last-child': {
		borderLeft: `1px solid ${theme.palette.common.borderGrey}`,
	},
}))

const Dashboard = styled(Section)(() => ({
	position: 'sticky',
	top: '0px',
	display: 'grid',
	maxHeight: '100vh',
	gap: '20px',
	gridTemplateRows: '10% auto 10%',
	marginLeft: 'auto',
	height: '100%',
	minWidth: '260px',
	padding: '0px 12px',
	paddingRight: '5%',
	boxSizing: 'border-box',
}))

export default function HomeLayout() {
	const { user } = useSelector(authSelector)
	const [isOpen, setOpen] = useState(false)
	const navigate = useNavigate()

	const createTweet = (tweet) => {
		const dismiss = () => toast.dismiss(toastId)
		setOpen(false)
		let toastId = toast(
			<Stack direction="row" gap="10px">
				Your Tweet was sent.
				<TweetLink
					to={`/status/${user.username}/${tweet.id}`}
					onClick={dismiss}
				>
					View
				</TweetLink>
			</Stack>,
			{ position: 'bottom-center' }
		)
	}

	return (
		<Layout>
			<Dashboard>
				<Stack alignItems="center" justifyContent="start" direction="row">
					<TitleIcon color="primary" onClick={() => navigate('/home')}>
						<i className="fa-solid fa-crow" />
					</TitleIcon>
				</Stack>
				<Stack gap="10px">
					<HomeLink to="/home">
						<i className="fa-solid fa-house-chimney-window" />
						<span>Home</span>
					</HomeLink>
					<HomeLink to="/explore">
						<i className="fa-solid fa-hashtag" />
						<span>Explore</span>
					</HomeLink>
					<HomeLink to="/notifications">
						<i className="fa-regular fa-bell" />
						<span>Notifications</span>
					</HomeLink>
					<HomeLink to="/messages">
						<i className="fa-regular fa-envelope" />
						<span>Messages</span>
					</HomeLink>
					<HomeLink to="/bookmarks">
						<i className="fa-regular fa-bookmark" />
						<span>Bookmarks</span>
					</HomeLink>
					<HomeLink to="/lists">
						<i className="fa-regular fa-rectangle-list" />
						<span>Lists</span>
					</HomeLink>
					<HomeLink to={`/profile/${user?.username || ''}`}>
						<i className="fa-regular fa-user" />
						<span>Profile</span>
					</HomeLink>
					<HomeLink to="/more">
						<i className="fa-solid fa-ellipsis" />
						<span>More</span>
					</HomeLink>
					<PrimaryButton onClick={() => setOpen(!isOpen)}>Tweet</PrimaryButton>
				</Stack>
				<Account />
			</Dashboard>
			<Section>
				<Outlet />
				<Modal open={isOpen} onClose={() => setOpen(false)}>
					<ModalBody sx={{ padding: '10px 30px' }}>
						<ModalControl
							icon="times"
							onClick={() => setOpen(false)}
							style={{ left: '10px', top: '10px' }}
						/>
						<WriteTweet onCreate={createTweet} />
					</ModalBody>
				</Modal>
				<Toaster />
			</Section>
			<Section />
		</Layout>
	)
}
