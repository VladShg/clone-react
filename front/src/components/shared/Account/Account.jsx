import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, logout } from '../../../store/auth/authSlice'
import styles from './Account.module.scss'
import Avatar from '../Avatar/Avatar'
import { styled } from '@mui/material/styles'
import { Container, Menu, MenuItem, Stack } from '@mui/material'

const Name = styled('span')(() => ({
	fontWeight: 'bold',
}))

const Description = styled('div')(() => ({
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
	fontSize: '15px',
}))

const Icon = styled('div')(() => ({
	position: 'absolute',
	right: '10px',
	top: '50%',
	transform: 'translateY(-50%)',
}))

const DropDown = styled(Menu)(({ theme }) => ({
	'.MuiMenu-paper': {
		borderRadius: '20px',
		border: `1px solid ${theme.palette.common.border}`,
		width: '300px',
	},
	'.MuiMenu-list': {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		gap: '10px',
	},
}))

const Item = styled('button')(({ theme }) => ({
	background: theme.palette.common.white,
	outline: 'none',
	border: 'none',
	padding: '20px 10px',
	width: '100%',
	textAlign: 'start',
	transition: 'color 0.2s, background-color 0.2s',
	color: theme.palette.common.black,
	fontFamily: 'Manrope, serif',
	fontSize: '16px',
	textDecoration: 'none',
	'&:hover': {
		textDecoration: 'none',
		color: theme.palette.primary.dark,
		cursor: 'pointer',
		backgroundColor: theme.palette.primary.bg,
	},
}))

const AccountContainer = styled('div')(({ hasMenu }) => ({
	display: 'flex',
	alignItems: 'center',
	fontSize: '24px',
	padding: '12px',
	borderRadius: '9999px',
	margin: '10px 0',
	transition: '0.2s ease background',
	'&:hover': {
		background: hasMenu ? 'var(--gray-fade)' : '',
		cursor: hasMenu ? 'pointer' : 'normal',
	},
	'&[disabled]': {
		opacity: '1 !important',
	},
}))

function AccountSkeleton({ name, username, avatar, hasMenu = false }) {
	const [anchor, setAnchor] = useState(null)
	const toggleMenu = (e) => {
		if (hasMenu) setAnchor(e.currentTarget)
	}
	const dispatch = useDispatch()

	const dropdown = (
		<DropDown
			anchorOrigin={{
				vertical: -20,
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			disableAutoFocusItem
			open={!!anchor}
			anchorEl={anchor}
			onClose={() => setAnchor(null)}
		>
			<MenuItem disabled component={AccountContainer} hasMenu={hasMenu}>
				<Avatar src={avatar} />
				<Description>
					<Name>{name}</Name>
					<span>@{username}</span>
				</Description>
			</MenuItem>
			<MenuItem component={Item} onClick={() => dispatch(logout())}>
				Log out from @{username}
			</MenuItem>
		</DropDown>
	)

	return (
		<Container disableGutters>
			{hasMenu && dropdown}
			<AccountContainer onClick={toggleMenu} hasMenu={hasMenu}>
				<Avatar src={avatar} />
				<Description>
					{hasMenu && (
						<Icon>
							<i className="fa-solid fa-ellipsis"></i>
						</Icon>
					)}
					<Name>{name}</Name>
					<span>@{username}</span>
				</Description>
			</AccountContainer>
		</Container>
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
