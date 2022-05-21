import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Router from './routes/Router'
import { useLazyAuthorizeQuery } from './services/authApi'
import { useLazyGetAvatarQuery } from './services/userApi'
import { authSelector, setToken, setUser } from './store/auth/authSlice'

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

	return <Router />
}
