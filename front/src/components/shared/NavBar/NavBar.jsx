import classNames from 'classnames'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NavBar.module.scss'

export default function NavBar({ navigateBack = false, title = 'Home' }) {
	const navigate = useNavigate()
	return (
		<div className={styles.NavBar}>
			<div className={styles.Wrapper}>
				<div className={styles.Background} />
				<button
					className={classNames(styles.Content, {
						[styles.NavigateBack]: navigateBack,
					})}
					onClick={() => {
						if (navigateBack) {
							navigate(-1)
						}
					}}
				>
					{navigateBack && <i className="fa-solid fa-arrow-left" />}
					{title}
				</button>
			</div>
		</div>
	)
}
