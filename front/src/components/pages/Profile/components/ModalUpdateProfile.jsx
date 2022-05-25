import Modal from '@shared/Modal/Modal'
import styles from './ModalUpdateProfile.module.scss'
import React, { useState } from 'react'
import Avatar from '@shared/Avatar/Avatar'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup
	.object({
		name: yup
			.string()
			.max(30, 'Name too long')
			.required('Name cannot be blank'),
		location: yup.string().max(30, 'Location too long'),
		bio: yup.string().max(60),
	})
	.required()

export default function ModalUpdateProfile({
	isOpen,
	setOpen,
	profile,
	update,
}) {
	const [avatar, setAvatar] = useState({ src: profile.avatar, file: null })
	const [background, setBackground] = useState({
		src: profile.background,
		file: null,
	})
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({ resolver: yupResolver(schema), mode: 'onChange' })
	const onSubmit = (data) => {
		let body = new FormData()
		for (let key of Object.keys(data)) {
			if (data[key]) {
				body.append(key, data[key])
			}
		}
		if (avatar.file) body.append('avatar', avatar.file)
		if (background.file) body.append('background', background.file)
		update(body)
	}

	return (
		<Modal className={styles.Modal} isOpen={isOpen} setOpen={setOpen}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.Actions}>
					<div className={styles.Description}>
						<Modal.Close className={styles.Close} />
						<span>Edit profile</span>
					</div>
					<button className={styles.Save} type="submit" disabled={!isValid}>
						Save
					</button>
				</div>
				<Background image={background} setImage={setBackground} />
				<div className={styles.Content}>
					<SelectAvatar image={avatar.src} setImage={setAvatar} />
					<Modal.Description>Name</Modal.Description>
					<Modal.Input
						defaultValue={profile.name}
						placeholder="Name"
						props={register('name')}
					/>
					<Modal.Warning>{errors.name?.message}</Modal.Warning>
					<Modal.Description>Bio</Modal.Description>
					<Modal.Input
						defaultValue={profile.bio}
						placeholder="Bio"
						props={register('bio')}
					/>
					<Modal.Warning>{errors.bio?.message}</Modal.Warning>
					<Modal.Description>Location</Modal.Description>
					<Modal.Input
						defaultValue={profile.location}
						placeholder="Location"
						props={register('location')}
					/>
					<Modal.Warning>{errors.location?.message}</Modal.Warning>
				</div>
			</form>
		</Modal>
	)
}

function SelectAvatar({ image, setImage }) {
	const inputRef = React.createRef()
	const selectImage = () => {
		inputRef.current.dispatchEvent(new MouseEvent('click', { bubbles: true }))
	}
	const onChange = (e) => {
		if (e.target.files.length) {
			const file = e.target.files[0]
			setImage({ src: URL.createObjectURL(file), file: file })
		}
	}

	return (
		<div className={styles.Avatar}>
			<Avatar
				className={styles.Preview}
				size={80}
				src={image}
				onClick={selectImage}
			/>
			<input
				className={styles.SetAvatar}
				onChange={onChange}
				ref={inputRef}
				type="file"
			/>
			<div className={styles.IconContainer} onClick={selectImage}>
				<i className={'fa-solid fa-camera'} />
			</div>
		</div>
	)
}

function Background({ image, setImage }) {
	const inputRef = React.createRef()
	const previewStyles = { backgroundImage: `url('${image.src}')` }
	const onChange = (e) => {
		if (e.target.files.length) {
			const file = e.target.files[0]
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
		<div className={styles.Background}>
			<input
				ref={inputRef}
				onChange={onChange}
				type="file"
				accept=".jpg, .jpeg, .png"
				className={styles.SetBackground}
			/>
			<div style={previewStyles} className={styles.LabelContainer}>
				<div onClick={selectImage}>
					<i className={'fa-solid fa-camera'} />
				</div>
				{image.file && (
					<div onClick={resetImage}>
						<i className={'fa-solid fa-times'} />
					</div>
				)}
			</div>
		</div>
	)
}
