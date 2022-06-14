import { alpha, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export const PrimaryButton = styled(Button)(({ theme }) => ({
	fontFamily: 'Manrope, serif',
	textDecoration: 'none',
	textTransform: 'none',
	background: theme.palette.primary.main,
	color: theme.palette.common.white,
	border: 'none',
	borderRadius: '20px',
	padding: '10px 20px',
	textAlign: 'center',
	fontSize: '12px',
	fontWeight: 'bold',
	transition: '0.2s ease background',
	'&:hover': {
		background: theme.palette.primary.dark,
		cursor: 'pointer',
	},
	'&[disabled]': {
		background: theme.palette.primary.inactive,
		color: theme.palette.common.white,
	},
}))

export const SecondaryButton = styled(Button)(({ theme }) => ({
	fontFamily: 'Manrope, serif',
	textDecoration: 'none',
	textTransform: 'none',

	backgroundColor: theme.palette.common.black,
	color: theme.palette.common.white,
	borderRadius: '20px',
	padding: '5px 20px',
	fontWeight: 'bold',
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.black, 0.7),
		cursor: 'pointer',
	},
	'&[disabled]': {
		backgroundColor: alpha(theme.palette.common.black, 0.5),
		color: theme.palette.common.white,
	},
}))
