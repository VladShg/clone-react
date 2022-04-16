import React, { useContext } from "react"
import { ProfileStyles as styles } from "../styles/_Styles"
import { AuthContext } from "./context/AuthContext"
import Avatar from "./shared/Avatar/Avatar"

export default function Profile() {
	const { user } = useContext(AuthContext)
	const { name, username, avatar } = user
	return (
		<div className={styles.container}>
			<Avatar src={avatar} />
			<div className={styles.description}>
				<span>{name}</span>
				<span className={styles.username}>{"@" + username}</span>
			</div>
		</div>
	)
}
