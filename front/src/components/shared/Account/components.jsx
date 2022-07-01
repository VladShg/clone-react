import isPropValid from '@emotion/is-prop-valid'
import { Menu, MenuItem, styled } from '@mui/material'

export const Name = styled('span')(() => ({
	fontWeight: 'bold',
}))

export const Description = styled('div')(() => ({
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
	fontSize: '15px',
}))

export const Icon = styled('div')(() => ({
	position: 'absolute',
	right: '10px',
	top: '50%',
	transform: 'translateY(-50%)',
}))

export const DropDown = styled(Menu)(({ theme }) => ({
	'.MuiMenu-paper': {
		borderRadius: '20px',
		border: `1px solid ${theme.palette.common.border}`,
		width: '300px',
	},
	'.MuiMenu-list': {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		gap: '10px',
	},
}))

export const Item = styled(MenuItem)(({ theme }) => ({
	fontFamily: 'Manrope, serif',
	fontSize: '16px',
	padding: '15px',
	transition: 'color 0.2s, background-color 0.2s',
	background: theme.palette.common.white,
	color: theme.palette.common.black,
	'&:hover': {
		color: theme.palette.primary.dark,
		background: theme.palette.primary.focus,
	},
}))

export const AccountContainer = styled('div', {
	shouldForwardProp: isPropValid,
})(({ theme, hasMenu }) => ({
	display: 'flex',
	gap: '15px',
	alignItems: 'center',
	fontSize: '24px',
	padding: '12px',
	borderRadius: '9999px',
	margin: '10px 0',
	transition: '0.2s ease background',
	'&:hover': {
		background: hasMenu ? theme.palette.common.fadeGrey : '',
		cursor: hasMenu ? 'pointer' : 'normal',
	},
	'&[disabled]': {
		opacity: '1 !important',
	},
}))

export const HelmetItem = styled(MenuItem)(({ theme }) => ({
	'&.Mui-disabled': {
		opacity: 1,
	},
	padding: '15px',
	borderBottom: `1px solid ${theme.palette.common.border}`,
}))

export const InnerContainer = styled(AccountContainer)(({ theme }) => ({
	borderRadius: '0px',
	borderBottom: `1px solid ${theme.palette.common.border}`,
	'&:hover': {
		background: theme.palette.common.white,
		cursor: 'default',
	},
}))
