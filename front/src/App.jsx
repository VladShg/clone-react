import { ThemeProvider, createTheme } from '@mui/material/styles'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Router from './routes/Router'
import { useLazyAuthorizeQuery } from './services/authApi'
import { useLazyGetAvatarQuery } from './services/userApi'
import { authSelector, setToken, setUser } from './store/auth/authSlice'

const theme = createTheme({
	typography: {
		fontFamily: 'Manrope',
		h1: { fontSize: '2em', margin: '0.67em 0', fontWeight: 'bold' },
		h2: { fontSize: '1.5em', margin: ' 0.83em 0', fontWeight: 'bold' },
		h3: { fontSize: '1.17em', margin: ' 1em 0', fontWeight: 'bold' },
		notice: { fontSize: '10px', lineHeight: '12px' },
	},
	palette: {
		primary: {
			main: '#1d9bf0',
			dark: '#1a8cd8',
		},
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
