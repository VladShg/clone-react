import React from 'react'
import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
} from 'react-router-dom'
import GitHubLogin from '@pages/GitHubLogin/GitHubLogin'
import HomeLayout from '@pages/Home/HomeLayout'
import Login from '@pages/Login/Login'
import Feed from '@pages/Feed/Feed'
import AuthRoute from './AuthRoute'
import PublicRoute from './PublicRoute'
import Status from '@pages/Status/Status'
import {
	Profile,
	ProfileLikes,
	ProfileReplies,
	ProfileTweets,
} from '@pages/Profile'

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
		<BrowserRouter basename="/react-clone/">
			<Routes>
				<Route path="/" element={authLayout}>
					<Route path="home" element={<Feed />} />
					<Route path="" element={<Navigate to="/home" />} />
					<Route path="profile/:username" element={<Profile />}>
						<Route path="replies" element={<ProfileReplies />} />
						<Route path="likes" element={<ProfileLikes />} />
						<Route path="" element={<ProfileTweets />} />
					</Route>
					<Route path="status/:username/:tweetId" element={<Status />} />
				</Route>
				<Route path="/auth/" element={publicLayout}>
					<Route path="login/github" element={<GitHubLogin />} />
					<Route path="login" element={<Login />} />
				</Route>
				<Route path="*" element={<Navigate to="/home" />} />
			</Routes>
		</BrowserRouter>
	)
}
