import { ThemeProvider, createTheme } from '@mui/material/styles'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Router from './routes/Router'
import { useLazyAuthorizeQuery } from './services/authApi'
import { useLazyGetAvatarQuery } from './services/userApi'
import { authSelector, setToken, setUser } from './store/auth/authSlice'
import { common } from '@mui/material/colors'
import { alpha } from '@mui/material'

const theme = createTheme({
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
		},
		common: {
			dark: '#536471',
		},
		tonalOffset: 0.2,
	},
})

export default function App() {
	const { token, user } = useSelector(authSelector)
	const [triggerLogin] = useLazyAuthorizeQuery()
	const [triggerAvatar] = useLazyGetAvatarQuery()
	const dispatch = useDispatch()

	const checkToken = async () => {
		if (token && !user) {
			const { data, isSuccess } = await triggerLogin(token)
			if (isSuccess) {
				const { data: avatar } = await triggerAvatar(data.username)
				const { id, name, username } = data
				dispatch(
					setUser({
						id,
						name,
						username,
						avatar,
					})
				)
			} else {
				dispatch(setToken(''))
			}
		}
	}

	useEffect(checkToken, [])

	useEffect(checkToken, [token])

	return (
		<ThemeProvider theme={theme}>
			<Router />
		</ThemeProvider>
	)
}
