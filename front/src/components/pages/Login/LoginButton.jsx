import { styled } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import Button from '@shared/Button/Button'

export const LoginButton = styled(Button)(({ theme }) => ({
	padding: '10px 0px',
	textAlign: 'center',
	fontSize: '16px',
	borderRadius: '50px',

	width: '100%',
	maxWidth: '300px',

	border: `1px solid ${grey.A200}`,
	background: theme.palette.common.white,
	color: theme.palette.primary.main,
	transition: '0.2s ease background',
	fontWeight: 'bold',
	'&:hover': {
		background: grey.A100,
		cursor: 'pointer',
	},
}))

export const SignUpButton = styled(Button)(({ theme }) => ({
	padding: '10px 0px',
	textAlign: 'center',
	fontSize: '16px',
	borderRadius: '50px',
	width: '100%',
	maxWidth: '300px',
	border: 'none',
	marginBottom: '10px',
	background: theme.palette.primary.main,
	color: theme.palette.common.white,
	transition: '0.2s ease background',
	fontWeight: 'bold',
	'&:hover': {
		background: theme.palette.primary.dark,
		cursor: 'pointer',
	},
}))
