import React from 'react'
import {
	nextStep,
	previousStep,
	registerSelector,
} from '@store/auth/registerSlice'
import styles from '../ModalRegister.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { AccountPreview } from '../../../Account/Account'
import { ModalControl, ModalLogo, ModalSubmit } from '@shared/Modal/Modal'
import { Stack, Typography } from '@mui/material'

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
			<input
				className={styles.AvatarInput}
				type="file"
				accept=".jpg, .jpeg, .png"
				onChange={onChange}
				placeholder="Upload profile picture"
			/>
			<div className={styles.AvatarPlaceholder}>
				<AccountPreview username={username} name={name} avatar={src} />
				{image && (
					<button title="Clear" onClick={onReset} className={styles.Clear}>
						<i className="fa-solid fa-xmark" />
					</button>
				)}
			</div>
			<ModalSubmit type="submit">{image ? 'Continue' : 'Skip'}</ModalSubmit>
		</Stack>
	)
}
