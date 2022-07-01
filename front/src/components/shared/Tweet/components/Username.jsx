import React from 'react'
import { styled } from '@mui/material'

const StyledUsername = styled('div')(({ theme }) => ({
	fontSize: '15px',
	fontWeight: '400px',
	lineHeight: '20px',
	color: theme.palette.common.dark,
}))

export default function Username({ children }) {
	return <StyledUsername>@{children}</StyledUsername>
}
