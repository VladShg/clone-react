import { styled } from '@mui/material'
import React from 'react'

const Container = styled('div')(() => ({
	height: '200px',
	width: '100%',
	// height: 'fit-content',
	position: 'relative',
}))

const SetBackground = styled('input')(() => ({
	width: '100%',
	height: '200px',
	position: 'relative',
	'&::after': {
		position: 'absolute',
		width: '100%',
		height: '100%',
		top: '0',
		left: '0',
		content: "''",
	},
}))

const LabelContainer = styled('div')(({ src, theme }) => ({
	position: 'absolute',
	width: '100%',
	height: '100%',
	top: '0',
	left: '0',
	display: 'flex',
	gap: '20px',
	justifyContent: 'center',
	alignItems: 'center',
	zIndex: 0,
	svg: {
		padding: '10px',
		fontSize: '24px',
		zIndex: 1,
		transition: 'transform 0.2s',
		'&:hover': { cursor: 'pointer', transform: 'scale(1.5)' },
	},
	backgroundColor: theme.palette.common.bgGrey,
	backgroundImage: src ? `url('${src}')` : '',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	objectFit: 'cover',
}))

export function SelectBackground({ image, setImage }) {
	const inputRef = React.createRef()
	const onChange = (e) => {
		if (e.target.files.length) {
			const file = e.target.files[0]
			e.target.value = null
			setImage({ src: URL.createObjectURL(file), file: file })
		}
	}
	const selectImage = () => {
		const event = new MouseEvent('click', { bubbles: true })
		inputRef.current.dispatchEvent(event)
	}

	const resetImage = () => {
		setImage({ src: '', file: null })
	}

	return (
		<Container>
			<SetBackground
				ref={inputRef}
				onChange={onChange}
				type="file"
				accept=".jpg, .jpeg, .png"
			/>
			<LabelContainer src={image?.src}>
				<div onClick={selectImage}>
					<i className={'fa-solid fa-camera'} />
				</div>
				{image.file && (
					<div onClick={resetImage}>
						<i className={'fa-solid fa-times'} />
					</div>
				)}
			</LabelContainer>
		</Container>
	)
}
