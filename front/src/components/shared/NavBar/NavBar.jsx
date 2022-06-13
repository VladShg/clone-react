import React from 'react'
import isPropValid from '@emotion/is-prop-valid'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material'

const Container = styled('div')(() => ({
	position: 'sticky',
	top: '0',
	left: '0',
	width: '100%',
	height: '40px',
	zIndex: 4,
}))

const Wrapper = styled('div')(() => ({
	position: 'relative',
	width: '100%',
	height: '100%',
}))

const Background = styled('div')(({ theme }) => ({
	position: 'absolute',
	width: '100%',
	height: '100%',
	backgroundColor: theme.palette.common.white,
	opacity: 0.9,
}))

const Control = styled('button', { shouldForwardProp: isPropValid })(
	({ back }) => ({
		position: 'absolute',
		width: '100%',
		height: '100%',
		boxSizing: 'border-box',
		padding: '0px 20px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'start',
		gap: '30px',
		fontSize: '24px',
		fontWeight: 'bold',
		opacity: 1,
		outline: 'none',
		border: 'none',
		background: 'none',

		svg: { transition: back ? 'transform 0.2s' : '' },
		'&:hover': {
			cursor: back ? 'pointer' : 'normal',
			'> svg': { transform: back ? 'translateX(-5px)' : '' },
		},
	})
)

export default function NavBar({ navigateBack = false, title = 'Home' }) {
	const navigate = useNavigate()
	const onClick = () => {
		if (navigateBack) {
			navigate(-1)
		}
	}

	return (
		<Container>
			<Wrapper>
				<Background />
				<Control back={navigateBack} onClick={onClick}>
					{navigateBack && <i className="fa-solid fa-arrow-left" />}
					{title}
				</Control>
			</Wrapper>
		</Container>
	)
}
