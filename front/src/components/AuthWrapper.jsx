import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLazyAuthorizeQuery } from '../services/userApi'
import { authSelector, logout, setUser } from '../store/auth/authSlice'

export default function AuthWrapper({ children }) {
	const { token, user } = useSelector(authSelector)
	const [trigger, data, { isLoading }] = useLazyAuthorizeQuery()
	const dispatch = useDispatch()

	useDispatch(async () => {
		if (token && (!user || (!data && !isLoading))) {
			let { data, isSuccess } = await trigger(token)
			if (isSuccess) {
				dispatch(
					setUser({ name: data.name, username: data.username, id: data.id })
				)
			} else {
				dispatch(logout())
			}
		}
	}, [])

	useEffect(async () => {
		if (token) {
			let { data, isSuccess } = await trigger(token)
			if (isSuccess) {
				dispatch(setUser(data))
			} else {
				dispatch(logout())
			}
		}
	}, [token])

	return <>{children}</>
}
