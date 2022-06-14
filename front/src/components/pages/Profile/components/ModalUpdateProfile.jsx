import React, { useState } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Modal, Stack, styled } from '@mui/material'
import { ModalBody, ModalControl, ModalField } from '@shared/Modal/Modal'
import { SecondaryButton } from '@shared/Button/Button'
import { SelectBackground } from './SelectBackground'
import { SelectAvatar } from './SelectAvatar'

const Content = styled(Stack)(() => ({
	position: 'relative',
	padding: '0px 10px',
	top: '-40px',
}))

const schema = yup
	.object({
		name: yup
			.string()
			.max(30, 'Name too long')
			.required('Name cannot be blank'),
		location: yup.string().max(30, 'Location too long'),
		bio: yup.string().max(60, 'Bio too long'),
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
		control,
		handleSubmit,
		formState: { isValid },
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
		defaultValues: {
			name: profile.name || '',
			bio: profile.bio || '',
			location: profile.location || '',
		},
	})

	const onSubmit = (data) => {
		let body = new FormData()
		for (let key of Object.keys(data)) {
			body.append(key, data[key])
		}
		if (avatar.file) body.append('avatar', avatar.file)
		if (background.file) body.append('background', background.file)
		update(body)
	}

	return (
		<Modal open={isOpen} onClose={() => setOpen(false)}>
			<ModalBody
				sx={{ padding: '20px 5px', maxWidth: '600px' }}
				component="form"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Stack padding="10px" direction="row" justifyContent="space-between">
					<Stack direction="row" gap="20px" alignItems="center">
						<ModalControl
							sx={{ position: 'static' }}
							icon="times"
							onClick={() => setOpen(false)}
						/>
						<span>Edit profile</span>
					</Stack>
					<SecondaryButton type="submit" disabled={!isValid}>
						Save
					</SecondaryButton>
				</Stack>
				<SelectBackground image={background} setImage={setBackground} />
				<Content gap="10px">
					<SelectAvatar image={avatar.src} setImage={setAvatar} />
					<Controller
						name="name"
						control={control}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<ModalField
								value={value}
								name="name"
								onChange={onChange}
								error={!!error?.message}
								label={'Name' || error?.message}
								placeholder="Name"
								fullWidth
							/>
						)}
					/>
					<Controller
						name="bio"
						control={control}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<ModalField
								value={value}
								name="bio"
								multiline
								rows={3}
								onChange={onChange}
								error={!!error?.message}
								label={'Bio' || error?.message}
								placeholder="Bio"
								fullWidth
							/>
						)}
					/>
					<Controller
						name="location"
						control={control}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<ModalField
								value={value}
								name="location"
								onChange={onChange}
								error={!!error?.message}
								label={'Location' || error?.message}
								placeholder="Location"
								fullWidth
							/>
						)}
					/>
				</Content>
			</ModalBody>
		</Modal>
	)
}
