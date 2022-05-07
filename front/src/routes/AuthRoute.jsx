import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { authSelector } from '../store/auth/authSlice'

export default function AuthRoute({ children }) {
	const { token } = useSelector(authSelector)
	if (!token) {
		return <Navigate to="/auth/login" />
	}
	return children
}
