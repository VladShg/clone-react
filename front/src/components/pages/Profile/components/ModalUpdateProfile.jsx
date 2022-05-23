import Modal from '@shared/Modal/Modal'
import React from 'react'

export default function ModalUpdateProfile({ isOpen, setOpen }) {
	return (
		<Modal isOpen={isOpen} setOpen={setOpen}>
			<Modal.Close />
		</Modal>
	)
}
