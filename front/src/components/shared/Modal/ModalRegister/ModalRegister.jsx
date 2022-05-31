import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { registerSelector } from '@store/auth/registerSlice'
import AvatarStep from './Steps/AvatarStep'
import InitialStep from './Steps/InitialStep'
import UsernameStep from './Steps/UsernameStep'
import PasswordStep from './Steps/PasswordStep'
import { useEffect } from 'react'
import { Modal } from '@mui/material'
import { ModalBody } from '../Modal'

export default function ModalRegister({ isOpen, setOpen }) {
	const { step } = useSelector(registerSelector)
	const [image, setImage] = useState(null)
	const handlers = [InitialStep, UsernameStep, AvatarStep, PasswordStep]
	const Current = handlers[step - 1]

	useEffect(() => {
		if (image && !isOpen) setImage(null)
	}, [isOpen])

	return (
		<Modal open={isOpen} onClose={() => setOpen(false)}>
			<ModalBody sx={{ maxWidth: '600px' }}>
				<Current image={image} setImage={setImage} setOpen={setOpen} />
			</ModalBody>
		</Modal>
	)
}
