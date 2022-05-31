import { LoadingButton } from '@mui/lab'
import { styled } from '@mui/material/styles'
import { grey, common } from '@mui/material/colors'

export const AuthButton = styled(LoadingButton)(({ theme }) => ({
	fontFamily: 'Manrope, serif',
	fontSize: '16px',
	fontWeight: 400,
	textAlign: 'center',
	textDecoration: 'none',
	textTransform: 'none',
	color: 'black',
	background: common.white,
	width: '100%',
	maxWidth: '300px',
	padding: '10px 0px',
	border: `1px solid ${grey.A200}`,
	borderRadius: '50px',
	transition: '0.2s ease background',
	'&:hover': {
		cursor: 'pointer',
		background: grey.A100,
	},
	'& .MuiLoadingButton-loadingIndicator': {
		color: theme.palette.primary.main,
	},
}))
