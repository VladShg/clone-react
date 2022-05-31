import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLazyGitHubLoginQuery } from '@services/authApi'
import { setToken } from '@store/auth/authSlice'
import Spinner from '@shared/Spinner/Spinner'
import { styled } from '@mui/material/styles'
import { Container } from '@mui/system'

const PageSpinner = styled(Spinner)(() => ({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '100px',
	height: '100px',
}))

export default function GitHubLogin() {
	const [trigger] = useLazyGitHubLoginQuery()
	const [params] = useSearchParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	useEffect(async () => {
		if (params.has('code')) {
			const code = params.get('code')
			let { data, isSuccess } = await trigger(code)
			if (isSuccess) {
				dispatch(setToken(data.accessToken))
				navigate('/home')
			} else {
				let errorParams = new URLSearchParams()
				errorParams.set('error', 'Failed to login')
				navigate('/auth/login?' + errorParams)
			}
		} else {
			navigate('/login')
		}
	}, [])

	return (
		<Container position="relative" height="100%" width="100%">
			<PageSpinner />
		</Container>
	)
}
