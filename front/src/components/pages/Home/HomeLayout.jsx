import React, { useState } from 'react'
import classNames from 'classnames'
import HomeLink from '@shared/HomeLink/HomeLink'
import styles from './HomeLayout.module.scss'
import { Link, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authSelector } from '@store/auth/authSlice'
import Account from '@shared/Account/Account'
import WriteTweet from '@shared/WriteTweet/WriteTweet'
import toast, { Toaster } from 'react-hot-toast'
import { Modal } from '@mui/material'
import { ModalBody, ModalControl } from '@shared/Modal/Modal'
import { PrimaryButton } from '@shared/Button/Button'
export default function HomeLayout() {
	const { user } = useSelector(authSelector)
	const [isOpen, setOpen] = useState(false)

	const createTweet = (tweet) => {
		const dismiss = () => toast.dismiss(toastId)
		setOpen(false)
		let toastId = toast(
			<>
				Your Tweet was sent.
				<Link
					to={`/status/${user.username}/${tweet.id}`}
					onClick={dismiss}
					className={styles.TweetLink}
				>
					View
				</Link>
			</>,
			{ position: 'bottom-center' }
		)
	}

	return (
		<>
			<div className={styles.Layout}>
				<div className={classNames(styles.Dashboard, styles.Section)}>
					<div className={styles.Header}>
						<i className="fa-solid fa-crow" />
					</div>
					<div className={styles.Main}>
						<HomeLink className={styles.Navigation} to="/home">
							<i className="fa-solid fa-house-chimney-window" />
							<span>Home</span>
						</HomeLink>
						<HomeLink className={styles.Navigation} to="/explore">
							<i className="fa-solid fa-hashtag" />
							<span>Explore</span>
						</HomeLink>
						<HomeLink className={styles.Navigation} to="/notifications">
							<i className="fa-regular fa-bell" />
							<span>Notifications</span>
						</HomeLink>
						<HomeLink className={styles.Navigation} to="/messages">
							<i className="fa-regular fa-envelope" />
							<span>Messages</span>
						</HomeLink>
						<HomeLink className={styles.Navigation} to="/bookmarks">
							<i className="fa-regular fa-bookmark" />
							<span>Bookmarks</span>
						</HomeLink>
						<HomeLink className={styles.Navigation} to="/lists">
							<i className="fa-regular fa-rectangle-list" />
							<span>Lists</span>
						</HomeLink>
						<HomeLink
							className={styles.Navigation}
							to={`/profile/${user?.username || ''}`}
						>
							<i className="fa-regular fa-user" />
							<span>Profile</span>
						</HomeLink>
						<HomeLink className={styles.Navigation} to="/more">
							<i className="fa-solid fa-ellipsis" />
							<span>More</span>
						</HomeLink>
						<PrimaryButton onClick={() => setOpen(!isOpen)}>
							Tweet
						</PrimaryButton>
					</div>
					<Account />
				</div>
				<div className={styles.Section}>
					<Outlet />
					<Modal open={isOpen} onClose={() => setOpen(false)}>
						<ModalBody sx={{ padding: '10px 30px' }}>
							<ModalControl
								icon="times"
								onClick={() => setOpen(false)}
								style={{ left: '10px', top: '10px' }}
							/>
							<WriteTweet onCreate={createTweet} />
						</ModalBody>
					</Modal>
					<Toaster />
				</div>
				<div className={styles.Section}></div>
			</div>
		</>
	)
}
