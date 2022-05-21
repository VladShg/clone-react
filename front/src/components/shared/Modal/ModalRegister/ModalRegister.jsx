import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { registerSelector } from '@store/auth/registerSlice'
import Modal from '../Modal'
import styles from './ModalRegister.module.scss'
import AvatarStep from './Steps/AvatarStep'
import InitialStep from './Steps/InitialStep'
import UsernameStep from './Steps/UsernameStep'
import PasswordStep from './Steps/PasswordStep'
import { useEffect } from 'react'

export default function ModalRegister({ isOpen, setOpen }) {
	const { step } = useSelector(registerSelector)
	const [image, setImage] = useState(null)
	const handlers = [InitialStep, AvatarStep, UsernameStep, PasswordStep]
	const Current = handlers[step - 1]

	useEffect(() => {
		if (image && !isOpen) setImage(null)
	}, [isOpen])

	return (
		<Modal isOpen={isOpen} setOpen={setOpen} className={styles.Register}>
			<Current image={image} setImage={setImage} />
		</Modal>
	)
}
