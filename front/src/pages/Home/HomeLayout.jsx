import React from 'react'
import classNames from 'classnames'
import HomeLink from '../../components/shared/HomeLink/HomeLink'
import Profile from '../../components/shared/Profile/Profile'
import styles from './HomeLayout.module.scss'
import ThemedLink from '../../components/shared/ThemedLink'
import { Outlet } from 'react-router-dom'

export default function HomeLayout() {
	return (
		<>
			<div className={styles.layout}>
				<div className={classNames(styles.dashboard, styles.section)}>
					<div className={styles.header}>
						<i className="fa-solid fa-crow" />
					</div>
					<div className={styles.main}>
						<HomeLink className={styles.navigation} to="/home">
							<i className="fa-solid fa-house-chimney-window" />
							<span>Home</span>
						</HomeLink>
						<HomeLink className={styles.navigation} to="/explore">
							<i className="fa-solid fa-hashtag" />
							<span>Explore</span>
						</HomeLink>
						<HomeLink className={styles.navigation} to="/notifications">
							<i className="fa-regular fa-bell" />
							<span>Notifications</span>
						</HomeLink>
						<HomeLink className={styles.navigation} to="/messages">
							<i className="fa-regular fa-envelope" />
							<span>Messages</span>
						</HomeLink>
						<HomeLink className={styles.navigation} to="/bookmarks">
							<i className="fa-regular fa-bookmark" />
							<span>Bookmarks</span>
						</HomeLink>
						<HomeLink className={styles.navigation} to="/lists">
							<i className="fa-regular fa-rectangle-list" />
							<span>Lists</span>
						</HomeLink>
						<HomeLink className={styles.navigation} to="/profile">
							<i className="fa-regular fa-user" />
							<span>Profile</span>
						</HomeLink>
						<HomeLink className={styles.navigation} to="/more">
							<i className="fa-solid fa-ellipsis" />
							<span>More</span>
						</HomeLink>
						<ThemedLink to="/tweet" theme="primary">
							Tweet
						</ThemedLink>
					</div>
					<Profile />
				</div>
				<div className={styles.section}>
					<Outlet />
				</div>
				<div className={styles.section}></div>
			</div>
		</>
	)
}
