import React from 'react'
import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
} from 'react-router-dom'
import GitHubLogin from '../pages/GitHubLogin/GitHubLogin'
import HomeLayout from '../pages/Home/HomeLayout'
import Login from '../pages/Login/Login'
import Feed from '../components/main/Feed'
import AuthRoute from './AuthRoute'
import PublicRoute from './PublicRoute'

export default function Router() {
	const authLayout = (
		<AuthRoute>
			<HomeLayout />
		</AuthRoute>
	)

	const publicLayout = (
		<PublicRoute>
			<Outlet />
		</PublicRoute>
	)

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={authLayout}>
					<Route path="home" element={<Feed />} />
					<Route path="" element={<Navigate to="/home" replace />} />
				</Route>
				<Route path="/auth/" element={publicLayout}>
					<Route path="login/github" element={<GitHubLogin />} />
					<Route path="login" element={<Login />} />
				</Route>
				<Route path="*" element={<Navigate to="/home" replace />} />
			</Routes>
		</BrowserRouter>
	)
}
