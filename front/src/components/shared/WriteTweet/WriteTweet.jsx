import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useCreateMutation } from '../../../services/tweetApi'
import { authSelector } from '../../../store/auth/authSlice'
import Avatar from '../Avatar/Avatar'
import WordCounter from '../WordCounter/WordCounter'
import { PrimaryButton } from '@shared/Button/Button'
import { InputBase, Stack, styled } from '@mui/material'
import { grey } from '@mui/material/colors'

export default function WriteTweet({
	placeholder = "What's happening",
	useWrite = useCreateMutation,
	onCreate = () => {},
	replyId = null,
	border,
}) {
	const { user } = useSelector(authSelector)
	const [createTweet, { isLoading }] = useWrite('shared-create-tweet')
	const [input, setInput] = useState('')
	const maxLength = 280

	let isDisabled = !input || maxLength < input.length || isLoading

	if (!user) {
		return null
	}

	return (
		<Stack
			padding="20px 10px"
			direction="row"
			borderBottom={border && `1px solid ${grey.A200}`}
		>
			<Avatar src={user.avatar} />
			<Stack direction="column" flexGrow="1">
				<TweetInput
					placeholder={placeholder}
					onChange={(e) => setInput(e.target.value)}
					multiline
					fullWidth
					value={input}
				/>
				<Stack direction="row-reverse">
					<PrimaryButton
						onClick={async (e) => {
							e.preventDefault()
							let res = await createTweet({ message: input, replyId })
							setInput('')
							onCreate(res.data)
						}}
						disabled={isDisabled}
					>
						Tweet
					</PrimaryButton>
					{input.length > 0 && <WordCounter text={input} />}
				</Stack>
			</Stack>
		</Stack>
	)
}

const TweetInput = styled(InputBase)(({ theme }) => ({
	display: 'block',
	width: '100%',
	maxWidth: '100%',
	overflow: 'hidden',
	lineHeight: '20px',
	wordBreak: 'break-word',
	marginBottom: '10px',

	fontFamily: 'Manrope, serif',
	fontSize: '16px',
	outline: 'none',
	resize: 'none',
	flexGrow: '1',
	border: 'none',

	'&:hover': {
		cursor: 'text',
	},

	'&:empty::before': {
		fontSize: '20px',
		color: theme.palette.grey,
	},
}))
