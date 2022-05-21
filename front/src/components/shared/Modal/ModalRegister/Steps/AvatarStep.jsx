import React from 'react'
import { nextStep, previousStep } from '@store/auth/registerSlice'
import Modal from '../../Modal'
import styles from '../ModalRegister.module.scss'
import { useDispatch } from 'react-redux'

export default function AvatarStep({ image, setImage }) {
	const dispatch = useDispatch()
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

	let contentRow = null
	if (image) {
		contentRow = (
			<>
				<span title={image.name} className={styles.Name}>
					{image.name}
				</span>
				<button title="Clear" onClick={onReset} className={styles.Clear}>
					<i className="fa-solid fa-xmark" />
				</button>
			</>
		)
	}

	return (
		<form onSubmit={onSubmit}>
			<Modal.Back onClick={() => dispatch(previousStep())} />
			<Modal.Logo />
			<Modal.Title>Add a profile picture</Modal.Title>
			<input
				className={styles.AvatarInput}
				type="file"
				accept=".jpg, .jpeg, .png"
				onChange={onChange}
				placeholder="Upload profile picture"
			/>
			<div className={styles.AvatarPlaceholder}>{contentRow}</div>
			<Modal.Button type="submit">{image ? 'Continue' : 'Skip'}</Modal.Button>
		</form>
	)
}
