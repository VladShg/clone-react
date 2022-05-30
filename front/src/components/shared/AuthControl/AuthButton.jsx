import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

export const AuthButton = styled(Button)({
	fontFamily: 'Manrope, serif',
	fontSize: '16px',
	fontWeight: 400,
	textAlign: 'center',
	textDecoration: 'none',
	textTransform: 'none',
	color: 'black',
	background: 'var(--white)',
	width: '100%',
	maxWidth: '300px',

	position: 'relative',
	marginBottom: '10px',
	padding: '10px 0px',
	boxSizing: 'border-box',
	display: 'inline-block',

	border: '1px solid var(--border-grey)',
	borderRadius: '50px',

	transition: '0.2s ease background',
	'&:hover': {
		cursor: 'pointer',
		background: 'var(--white-fade)',
	},
})
