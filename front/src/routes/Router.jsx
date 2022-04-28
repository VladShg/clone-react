import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login/Login'
import AuthRoute from './AuthRoute'

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/home"
					element={
						<AuthRoute>
							<Home />
						</AuthRoute>
					}
				/>
				<Route path="/login" element={<Login />} />
				<Route
					path="/"
					element={
						<AuthRoute>
							<Home />
						</AuthRoute>
					}
				/>
				<Route
					path="*"
					element={
						<AuthRoute>
							<Home />
						</AuthRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}
