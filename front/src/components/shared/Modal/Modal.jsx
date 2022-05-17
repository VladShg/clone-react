import React, { useContext, useEffect, useRef } from 'react'
import styles from './Modal.module.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setOpen: PropTypes.func.isRequired,
	children: PropTypes.node,
}

const ModalContext = React.createContext(null)

export default function Modal({ isOpen, setOpen, children, className }) {
	const wrapper = useRef(null)

	const checkClick = (event) => {
		if (event.target === wrapper.current) {
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

	const containerStyles = classNames(styles.container, className || '')
		.split(' ')
		.reverse()
		.join(' ')
	return (
		<ModalContext.Provider value={value}>
			<div ref={wrapper} className={styles.wrapper}>
				<div className={containerStyles}>{children}</div>
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

Modal.Separator = function ModalSeparator({ children }) {
	return (
		<div className={styles.Separator}>
			<div className={styles.SeparatorLine}></div>
			<div className={styles.SeparatorText}>{children}</div>
			<div className={styles.SeparatorLine}></div>
		</div>
	)
}

Modal.Link = function ModalLink({
	children,
	className,
	href = '##',
	...props
}) {
	let classes = classNames(styles.Link, className || '')
	return (
		<Link to={href} className={classes} {...props}>
			{children}
		</Link>
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
