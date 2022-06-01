import { Button } from '@mui/material'
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
