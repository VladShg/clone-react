import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, logout } from '../../../store/auth/authSlice'
import Avatar from '../Avatar/Avatar'
import { Container } from '@mui/material'
import {
	AccountContainer,
	Description,
	DropDown,
	HelmetItem,
	InnerContainer,
	Item,
	Name,
	Icon,
} from './components'

function AccountSkeleton({ name, username, avatar, hasMenu = false }) {
	const [anchor, setAnchor] = useState(null)
	const toggleMenu = (e) => {
		if (hasMenu) setAnchor(e.currentTarget)
	}
	const dispatch = useDispatch()

	const dropdown = (
		<DropDown
			elevation={4}
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
			<HelmetItem disabled component={InnerContainer} hasMenu={hasMenu}>
				<Avatar src={avatar} />
				<Description>
					<Name>{name}</Name>
					<span>@{username}</span>
				</Description>
			</HelmetItem>
			<Item onClick={() => dispatch(logout())}>Log out from @{username}</Item>
		</DropDown>
	)

	return (
		<Container disableGutters sx={{ position: 'relative' }}>
			{hasMenu && dropdown}
			<AccountContainer onClick={toggleMenu} hasMenu={hasMenu}>
				<Avatar src={avatar} />
				<Description>
					{hasMenu && (
						<Icon>
							<i className="fa-solid fa-ellipsis" />
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
