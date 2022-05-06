import classNames from 'classnames'
import React, { useRef, useState, useEffect } from 'react'
import { useDeleteMutation } from '../../../services/tweetApi'
import styles from './Menu.module.scss'

export default function Menu({ id }) {
	const [triggerDelete] = useDeleteMutation()
	const [isOpen, setOpen] = useState(false)
	const triggerRef = useRef(null)
	const menuRef = useRef(null)

	useEffect(() => {
		const listener = (event) => {
			const menu = menuRef.current
			const trigger = triggerRef.current
			const target = event.target
			if (isOpen && !menu.contains(target) && !trigger.contains(target)) {
				setOpen(false)
			}
		}
		document.addEventListener('click', listener)
		return () => document.removeEventListener('click', listener)
	})

	const dropdown = (
		<ul
			className={classNames(styles.Dropdown, { [styles.Open]: isOpen })}
			ref={menuRef}
		>
			<li className={styles.Item} onClick={() => triggerDelete(id)}>
				Delete
			</li>
		</ul>
	)

	return (
		<>
			<div className={styles.Menu}>
				<div className={styles.DropdownWrapper}>
					<button
						ref={triggerRef}
						className={classNames(styles.MenuIcon, styles.IconWrapper)}
						onClick={() => {
							setOpen(!isOpen)
						}}
					>
						<i className="fa-solid fa-ellipsis"></i>
					</button>
					{dropdown}
				</div>
			</div>
		</>
	)
}
