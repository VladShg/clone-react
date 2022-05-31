import React from 'react'
import {
	nextStep,
	previousStep,
	registerSelector,
} from '@store/auth/registerSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AccountPreview } from '../../../Account/Account'
import { ModalControl, ModalLogo, ModalSubmit } from '@shared/Modal/Modal'
import { IconButton, Stack, Typography } from '@mui/material'
import { AvatarInput } from '../ProfilePreview'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function AvatarStep({ image, setImage }) {
	const dispatch = useDispatch()
	const { name, username } = useSelector(registerSelector).profile
	const onSubmit = (e) => {
		e.preventDefault()
		dispatch(nextStep())
	}

	const onReset = () => setImage(null)
	const onChange = (e) => {
		if (!e.target.files.length) {
			return
		}
		const file = e.target.files[0]
		e.target.value = null
		if (file) {
			setImage(file)
		}
	}

	let src = image ? URL.createObjectURL(image) : ''

	return (
		<Stack component="form" direction="column" gap="20px" onSubmit={onSubmit}>
			<ModalControl
				icon="arrow-left"
				onClick={() => dispatch(previousStep())}
			/>
			<ModalLogo />
			<Typography variant="modalTitle">Add a profile picture</Typography>
			<AvatarInput type="file" accept=".jpg, .jpeg, .png" onChange={onChange} />
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<AccountPreview username={username} name={name} avatar={src} />
				{image && (
					<IconButton onClick={onReset}>
						<FontAwesomeIcon fontSize="24" icon={solid('xmark')} />
					</IconButton>
				)}
			</Stack>
			<ModalSubmit type="submit">{image ? 'Continue' : 'Skip'}</ModalSubmit>
		</Stack>
	)
}
