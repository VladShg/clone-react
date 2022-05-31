import React from 'react'
import { styled } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import { alpha, Button, Grid, Stack, TextField } from '@mui/material'
import { SubtleLogo } from '@shared/Logo/Logo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const ModalBody = styled(Stack)(({ theme }) => ({
	backgroundColor: theme.palette.common.white,
	display: 'flex',
	flexDirection: 'column',
	gap: '10px',
	position: 'relative',
	top: '50%',
	left: '50%',
	maxWidth: '400px',
	boxSizing: 'border-box',
	margin: '0',
	borderRadius: '50px',
	padding: '40px 80px',
	transform: 'translate(-50%, -50%)',
}))

export const ModalField = styled(TextField)(({ theme }) => ({
	color: theme.palette.common.black,
	border: grey.A200,
	fontSize: '15px',
	lineHeight: '16px',
	display: 'block',
	width: '100%',
	boxSizing: 'border-box',
	'::placeholder': {
		color: theme.palette.common.dark,
	},
}))

export const ModalSubmit = styled(Button)(({ theme }) => ({
	backgroundColor: theme.palette.common.dark,
	borderRadius: '9999px',
	color: theme.palette.common.white,
	textTransform: 'none',
	border: 'none',
	outline: 'none',

	padding: '16px 10px',
	width: '100%',

	'&[disabled]': {
		color: theme.palette.common.white,
		backgroundColor: alpha(theme.palette.common.dark, 0.4),
	},

	'&:hover': {
		backgroundColor: alpha(theme.palette.common.dark, 0.9),
	},
}))

export const ModalControl = styled(FontAwesomeIcon)(({ theme }) => ({
	color: theme.palette.common.black,
	position: 'absolute',
	top: '30px',
	left: '30px',
	fontSize: '24px',
	transition: '0.2s ease transform',
	'&:hover': {
		transform: 'translateY(-2px)',
		cursor: 'pointer',
	},
}))

export function ModalLogo() {
	return (
		<Grid container justifyContent="center">
			<SubtleLogo icon="crow" />
		</Grid>
	)
}

export default null
