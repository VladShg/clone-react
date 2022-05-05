import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Router from './routes/Router'
import { useLazyAuthorizeQuery } from './services/authApi'
import { authSelector, setToken, setUser } from './store/auth/authSlice'

export default function App() {
	const { token, user } = useSelector(authSelector)
	const [triggerLogin] = useLazyAuthorizeQuery()
	const dispatch = useDispatch()

	const checkToken = async () => {
		if (token && !user) {
			const { data, isSuccess } = await triggerLogin(token)
			if (isSuccess) {
				dispatch(
					setUser({ id: data.id, name: data.name, username: data.username })
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
