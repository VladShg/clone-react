import React from 'react'
import Avatar from '@shared/Avatar/Avatar'
import { styled } from '@mui/material'

const Container = styled('div')(() => ({
	position: 'relative',
	width: 'fit-content',
	marginBottom: '20px',
	marginRight: '0px',
}))

const Input = styled('input')(() => ({
	display: 'none',
}))

const IconContainer = styled('div')(() => ({
	position: 'absolute',
	width: '100%',
	height: '100%',
	top: '0',
	left: '0',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	svg: {
		transition: 'transform 0.2s',
		'&:hover': { transform: 'scale(1.5)', cursor: 'pointer' },
	},
}))

export function SelectAvatar({ image, setImage }) {
	const inputRef = React.createRef()
	const selectImage = () => {
		inputRef.current.dispatchEvent(new MouseEvent('click', { bubbles: true }))
	}
	const onChange = (e) => {
		if (e.target.files.length) {
			const file = e.target.files[0]
			e.target.value = null
			setImage({ src: URL.createObjectURL(file), file: file })
		}
	}

	return (
		<Container>
			<Avatar size={80} src={image} />
			<Input
				onChange={onChange}
				ref={inputRef}
				type="file"
				accept=".jpg, .jpeg, .png"
			/>
			<IconContainer onClick={selectImage}>
				<i className={'fa-solid fa-camera'} />
			</IconContainer>
		</Container>
	)
}
