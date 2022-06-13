import React from 'react'
import { styled } from '@mui/material'
import isPropValid from '@emotion/is-prop-valid'

export const AvatarWrapper = styled('div')(() => ({
	display: 'flex',
	position: 'relative',
	marginRight: '15px',
}))

export const AvatarImage = styled('div', { shouldForwardProp: isPropValid })(
	({ size, src, theme }) => ({
		width: size + 'px',
		height: size + 'px',
		backgroundImage: `url('${src}')`,
		display: 'inline-block',
		backgroundColor: theme.palette.common.fadeGrey,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		borderRadius: '50%',
	})
)

export default function Avatar({ src, size = 40 }) {
	return (
		<AvatarWrapper>
			<AvatarImage size={size} src={src} />
		</AvatarWrapper>
	)
}
