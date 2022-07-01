import React from 'react'

import { IconButton as MUIIconButton, styled } from '@mui/material'

export const ActionContainer = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'space-around',
	alignItems: 'center',
	padding: '20px 0px',
	borderBottom: `1px solid v${theme.palette.common.border}`,
}))

const IconButton = styled(MUIIconButton)(({ isActive }) => ({
	position: 'relative',
	zIndex: 3,

	span: {
		position: 'absolute',
		left: '35px',
		top: '50%',
		transform: 'translateY(-50%)',
	},

	[!isActive && ':not(:hover)']: {
		color: 'grey',
	},
}))

const Wrapper = styled('button')(() => ({
	border: 'none',
	outline: 'none',
	background: 'none',

	display: 'flex',
	gap: '10px',
	alignItems: 'center',
}))

const Action = styled('div')(() => ({
	span: {
		fontFamily: 'Manrope',
		fontSize: '14px',
	},
	svg: {
		fontSize: '16px',
	},
}))

export const TweetAction = ({
	children,
	isActive = false,
	color = 'reply',
	value,
	...props
}) => {
	return (
		<Action {...props} isActive={isActive}>
			<Wrapper color="color">
				<IconButton isActive={isActive} color={color}>
					{children}
					<span>{!!value && value}</span>
				</IconButton>
			</Wrapper>
		</Action>
	)
}
