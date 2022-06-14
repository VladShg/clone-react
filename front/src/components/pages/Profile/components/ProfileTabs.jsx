import React from 'react'
import { styled, Tab, Tabs } from '@mui/material'
import { Link, matchPath, useLocation } from 'react-router-dom'

function useRouteMatch(patterns) {
	const { pathname } = useLocation()

	for (let i = 0; i < patterns.length; i += 1) {
		const pattern = patterns[i]
		const possibleMatch = matchPath(pattern, pathname)
		if (possibleMatch !== null) {
			return possibleMatch
		}
	}

	return null
}

const StyledTabs = styled((props) => (
	<Tabs
		{...props}
		TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
	/>
))(({ theme }) => ({
	'& .MuiTabs-indicator': {
		display: 'flex',
		height: '4px',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	'& .MuiTabs-indicatorSpan': {
		background: theme.palette.primary.main,
		width: '60%',
		height: '4px',
		borderRadius: '20px',
	},
}))

const StyledTab = styled(Tab)(({ theme }) => ({
	padding: '20px 0px',
	color: theme.palette.common.dark,
	textDecoration: 'none',
	fontWeight: 'bold',
	'&:hover': {
		cursor: 'pointer',
		background: theme.palette.common.fadeGrey,
	},
	'&.Mui-selected': {
		color: theme.palette.common.black,
		position: 'relative',
	},
}))

export default function ProfileTabs({ profile }) {
	const routeMatch = useRouteMatch([
		`/profile/${profile.username}/replies`,
		`/profile/${profile.username}/likes`,
		`/profile/${profile.username}`,
	])
	const currentTab = routeMatch?.pattern?.path

	return (
		<StyledTabs value={currentTab} variant="fullWidth">
			<StyledTab
				label="Tweets"
				value={`/profile/${profile.username}`}
				to={`/profile/${profile.username}`}
				component={Link}
			/>
			<StyledTab
				label="Tweets & replies"
				value={`/profile/${profile.username}/replies`}
				to={`/profile/${profile.username}/replies`}
				component={Link}
			/>
			<StyledTab
				label="Likes"
				value={`/profile/${profile.username}/likes`}
				to={`/profile/${profile.username}/likes`}
				component={Link}
			/>
		</StyledTabs>
	)
}
