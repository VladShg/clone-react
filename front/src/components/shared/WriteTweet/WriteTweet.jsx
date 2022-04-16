import React, { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import Avatar from "../Avatar/Avatar"
import Button from "../Button/Button"
import WordCounter from "../WordCounter/WordCounter"
import styles from "./WriteTweet.module.scss"

export default function WriteTweet() {
	const { user } = useContext(AuthContext)
	const [input, setInput] = useState("")
	const maxLength = 140

	let isDisabled = !input || maxLength < input.length

	return (
		<div className={styles.container}>
			<Avatar src={user.avatar} />
			<div className={styles.inputRow}>
				<span
					className={styles.input}
					role="textbox"
					contentEditable
					onInput={(e) => setInput(e.target.textContent)}
					value={input}
				></span>
				<div className={styles.mediaRow}>
					<Button disabled={isDisabled}>Tweet</Button>
					{input.length > 0 && <WordCounter text={input} />}
				</div>
			</div>
		</div>
	)
}
