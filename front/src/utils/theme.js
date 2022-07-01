import { common } from '@mui/material/colors'
import { alpha, createTheme } from '@mui/material'

export const theme = createTheme({
	typography: {
		fontFamily: 'Manrope',
		h1: { fontSize: '2em', margin: '0.67em 0', fontWeight: 'bold' },
		h2: { fontSize: '1.5em', margin: '0.83em 0', fontWeight: 'bold' },
		h3: { fontSize: '1.17em', margin: '1em 0', fontWeight: 'bold' },
		notice: { fontSize: '10px', lineHeight: '12px' },
		modalSub: {
			color: common.black,
			fontWeight: '700',
			fontSize: '15px',
			lineHeight: '20px',
		},
		modalTitle: {
			color: common.black,
			fontWeight: '700',
			fontSize: '31px',
			lineHeight: '36px',
		},
		modalDesc: {
			color: '#536471',
			fontWeight: '400',
			fontSize: '14px',
			lineHeight: '16px',
		},
	},
	palette: {
		primary: {
			main: '#1d9bf0',
			dark: '#1a8cd8',
			inavtive: alpha('#1d9bf0', 0.4),
			focus: alpha('#1d9bf0', 0.1),
		},
		common: {
			dark: '#536471',
			border: '#eff3f4',
			grey: '#999999',
			fadeGrey: '#e7e7e8',
			bgGrey: '#cfd9de',
		},
		error: {
			main: '#F4212E',
		},
		warning: {
			main: '#FFD400',
		},
		like: {
			main: '#f9318e',
			background: '#f7e0eb',
		},
		reply: {
			main: '#1d9bf0',
		},
		retweet: {
			main: '#1cc18a',
		},
		tonalOffset: 0.2,
	},
})
