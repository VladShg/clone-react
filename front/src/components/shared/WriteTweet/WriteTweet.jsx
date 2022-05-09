import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useCreateMutation } from '../../../services/tweetApi'
import { authSelector } from '../../../store/auth/authSlice'
import Avatar from '../Avatar/Avatar'
import Button from '../Button/Button'
import WordCounter from '../WordCounter/WordCounter'
import styles from './WriteTweet.module.scss'
import TextareaAutosize from 'react-textarea-autosize'

export default function WriteTweet() {
	const { user } = useSelector(authSelector)
	const [createTweet, { isLoading }] = useCreateMutation()
	const [input, setInput] = useState('')
	const maxLength = 280

	let isDisabled = !input || maxLength < input.length || isLoading

	if (!user) {
		return null
	}

	return (
		<div className={styles.container}>
			<Avatar src={user.avatar} />
			<div className={styles.inputRow}>
				<TextareaAutosize
					multiple
					type="text"
					className={styles.input}
					placeholder="What's happening?"
					onChange={(e) => setInput(e.target.value)}
					value={input}
				/>
				<div className={styles.mediaRow}>
					<Button
						onClick={async (e) => {
							e.preventDefault()
							await createTweet(input)
							setInput('')
						}}
						disabled={isDisabled}
					>
						Tweet
					</Button>
					{input.length > 0 && <WordCounter text={input} />}
				</div>
			</div>
		</div>
	)
}
