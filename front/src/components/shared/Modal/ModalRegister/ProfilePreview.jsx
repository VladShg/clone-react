import { styled } from '@mui/material/styles'

export const AvatarInput = styled('input')(({ theme }) => ({
	position: 'relative',
	height: '60px',
	borderRadius: '10px',
	boxSizing: 'border-box',
	width: '100%',
	textAlign: 'center',
	padding: '40px 10px',
	margin: '0',

	'&:hover': {
		'&::after': {
			cursor: 'pointer',
			borderColor: theme.palette.primary.dark,
		},
		'&::before': {
			cursor: 'pointer',
			textDecoration: 'underline',
			color: theme.palette.primary.dark,
		},
	},

	'&::after': {
		position: 'absolute',
		boxSizing: 'border-box',
		content: '""',
		width: '100%',
		height: '100%',
		top: '0',
		left: '0',
		backgroundColor: theme.palette.common.white,
		zIndex: '1',
		border: `2px solid ${theme.palette.primary.main}`,
		borderRadius: '10px',
	},
	'&::before': {
		fontFamily: 'Manrope',
		fontWeight: '500',
		content: '"Select image"',
		fontSize: '16px',
		zIndex: '2',
		color: theme.palette.primary.main,
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
	},
}))
