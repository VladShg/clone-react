import { ClickAwayListener, styled } from '@mui/material'
import isPropValid from '@emotion/is-prop-valid'
import { useDeleteMutation } from '@services/tweetApi'
import React, { useState } from 'react'

const Menu = styled('div')(() => ({
	position: 'absolute',
	right: '5px',
	top: '5px',
	padding: '5px',
}))

const DropDown = styled('ul', { shouldForwardProp: isPropValid })(
	({ theme, isOpen }) => ({
		position: 'absolute',
		top: '20px',
		right: '0px',
		padding: '10px',
		zIndex: 3,
		borderRadius: '9999px',
		background: theme.palette.common.white,
		border: `1px solid ${theme.palette.common.border}`,
		listStyle: 'none',
		display: isOpen ? 'block' : 'none',
	})
)

const MenuIcon = styled('button')(({ theme }) => ({
	position: 'relative',
	borderRadius: '9999px',
	border: 'none',
	outline: 'none',
	padding: '10px',
	background: 'none',
	'svg, button': { transition: '0.1 ease all' },
	'&:hover': {
		cursor: 'pointer',
		background: theme.palette.primary.focus,
		'svg, button': {
			cursor: 'pointer',
			color: theme.palette.primary.dark,
		},
	},
	zIndex: 2,
}))

const Item = styled('li')(({ theme }) => ({
	transition: '0.1 ease color',
	'&:hover': { cursor: 'pointer', color: theme.palette.primary.dark },
}))

export default function DeleteTweet({ id }) {
	const [triggerDelete] = useDeleteMutation()
	const [isOpen, setOpen] = useState(false)

	const onToggle = () => setOpen(!isOpen)
	const onClose = () => setOpen(false)

	return (
		<>
			<Menu>
				<ClickAwayListener onClickAway={onClose}>
					<MenuIcon onClick={onToggle}>
						<i className="fa-solid fa-ellipsis"></i>
					</MenuIcon>
				</ClickAwayListener>
				<DropDown isOpen={isOpen}>
					<Item onClick={() => triggerDelete(id)}>Delete</Item>
				</DropDown>
			</Menu>
		</>
	)
}
