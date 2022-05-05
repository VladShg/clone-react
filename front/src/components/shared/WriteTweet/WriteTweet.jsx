import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useCreateMutation } from '../../../services/tweetApi'
import { authSelector } from '../../../store/auth/authSlice'
import Avatar from '../Avatar/Avatar'
import Button from '../Button/Button'
import WordCounter from '../WordCounter/WordCounter'
import styles from './WriteTweet.module.scss'

export default function WriteTweet() {
	const { user } = useSelector(authSelector)
	const [createTweet, { isLoading }] = useCreateMutation()
	const [input, setInput] = useState('')
	const maxLength = 140

	let isDisabled = !input || maxLength < input.length || isLoading

	if (!user) {
		return null
	}

	const submitTweet = async (e) => {
		e.preventDefault()
		const response = await createTweet({ message: input })
	}

	return (
		<form onSubmit={submitTweet} className={styles.container}>
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
					<Button type="submit" disabled={isDisabled}>
						Tweet
					</Button>
					{input.length > 0 && <WordCounter text={input} />}
				</div>
			</div>
		</form>
	)
}
