import React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { styled } from '@mui/material'

HomeLink.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
}

const Link = styled('div', { shouldForwardProp: isPropValid })(
	({ isActive, theme }) => ({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'start',
		gap: '20px',

		fontFamily: 'Manrope, serif',
		fontWeight: 'normal',
		fontSize: '20px',
		textDecoration: 'none',
		borderRadius: '9999px',
		transition: '0.2s ease background',
		'&:hover': { background: theme.palette.common.fadeGrey },
		color: theme.palette.common.black,
		padding: '10px',
		paddingLeft: '20px',
		'> svg': { width: '30px', textAlign: 'center', fontSize: '24px' },

		'> svg, > span': {
			fontWeight: isActive ? 'bold' : 'normal',
			textDecoration: 'none',
		},
	})
)

export default function HomeLink({ children, to }) {
	return (
		<NavLink to={to} style={{ textDecoration: 'none' }}>
			{({ isActive }) => <Link isActive={isActive}>{children}</Link>}
		</NavLink>
	)
}
