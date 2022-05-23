import React from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import styles from '../Profile.module.scss'

export default function ProfileLink({ children, ...props }) {
	return (
		<NavLink
			className={({ isActive }) => {
				return classNames(styles.Tab, { [styles.ActiveTab]: isActive })
			}}
			{...props}
		>
			{children}
		</NavLink>
	)
}
