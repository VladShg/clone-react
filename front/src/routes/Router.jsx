import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login/Login'
import AuthRoute from './AuthRoute'
import PublicRoute from './PublicRoute'

export default function Router() {
	const auth = (children) => {
		return <AuthRoute>{children}</AuthRoute>
	}

	const unauthorized = (children) => {
		return <PublicRoute>{children}</PublicRoute>
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/home" element={auth(<Home />)} />
				<Route path="/login" element={unauthorized(<Login />)} />
				<Route path="/" element={auth(<Home />)} />
				<Route path="*" element={auth(<Home />)} />
			</Routes>
		</BrowserRouter>
	)
}
