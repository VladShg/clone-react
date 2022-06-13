import React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import { SpinnerCircular } from 'spinners-react'
import { styled } from '@mui/material'

const StyledSpinner = styled(SpinnerCircular, {
	shouldForwardProp: isPropValid,
})(({ theme, size }) => ({
	width: `${size}px`,
	height: `${size}px`,
	color: `${theme.palette.primary.main} !important`,
	'> circle:first-child': { stroke: theme.palette.common.fadeGrey },
	'> circle': { strokeWidth: '8px' },
}))

export default function Spinner({ size = 20 }) {
	return <StyledSpinner size={size} />
}
