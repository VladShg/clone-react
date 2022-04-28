import React, { useContext, useEffect, useRef } from 'react'
import styles from './Modal.module.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setOpen: PropTypes.func.isRequired,
	children: PropTypes.node,
}

const ModalContext = React.createContext(null)

export default function Modal({ isOpen, setOpen, children }) {
	const content = useRef(null)

	const checkClick = (event) => {
		if (isOpen && !content.current.contains(event.target)) {
			setOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('click', checkClick)
		return () => document.removeEventListener('click', checkClick)
	})

	if (!isOpen || !children) {
		return null
	}

	const value = {
		isOpen,
		setOpen,
	}

	return (
		<ModalContext.Provider value={value}>
			<div className={styles.wrapper}>
				<div ref={content} className={styles.container}>
					{children}
				</div>
			</div>
		</ModalContext.Provider>
	)
}

Modal.Close = function ModalClose({ className }) {
	const { setOpen } = useContext(ModalContext)
	const classes = classNames(className || '', styles.Close)

	const onClick = (e) => {
		e.stopPropagation()
		setOpen(false)
	}

	return (
		<div onClick={onClick} className={classes}>
			<i className="fas fa-times" />
		</div>
	)
}

Modal.Back = function ModalBack({ className, ...props }) {
	return (
		<div className={classNames(className || '', styles.Back)} {...props}>
			<i className="fas fa-arrow-left" />
		</div>
	)
}

Modal.Button = function ModalButton({ className, children, ...props }) {
	return (
		<button className={classNames(className || '', styles.Button)} {...props}>
			{children}
		</button>
	)
}

Modal.Warning = function ModalWarning({ className, children, ...props }) {
	return (
		<div className={classNames(className || '', styles.Warning)} {...props}>
			{children}
		</div>
	)
}

Modal.DatePicker = function ModalDatePicker({ className, ...props }) {
	return (
		<input
			type="date"
			className={classNames(className || '', styles.DatePicker)}
			{...props}
		/>
	)
}

Modal.Input = function ModalInput({ className, ...props }) {
	return (
		<input className={classNames(className || '', styles.Input)} {...props} />
	)
}

Modal.Title = function ModalTitle({ children, className }) {
	return (
		<h1 className={classNames(className || '', styles.Title)}>{children}</h1>
	)
}

Modal.SubTitle = function ModalSubTitle({ children, className }) {
	return (
		<h2 className={classNames(className || '', styles.SubTitle)}>{children}</h2>
	)
}

Modal.Description = function ModalDescription({ children, className }) {
	return (
		<div className={classNames(className || '', styles.Description)}>
			{children}
		</div>
	)
}

Modal.Logo = function ModalLogo({ className }) {
	const classes = classNames(className || '', styles.LogoContainer)
	return (
		<div className={classes}>
			<i className="fa-solid fa-crow" />
		</div>
	)
}
