import React from "react"
import styles from "./Feed.module.scss"
import Header from "../shared/Header/Header"
import WriteTweet from "../shared/WriteTweet/WriteTweet"

export default function Feed() {
	return (
		<div className={styles.container}>
			<Header>
				<span>Home</span>
				<i className="fa-solid fa-wand-magic-sparkles" />
			</Header>
			<WriteTweet />
		</div>
	)
}
