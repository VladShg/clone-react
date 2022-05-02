import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLazyGitHubLoginQuery } from '../../services/authApi'
import { setToken } from '../../store/auth/authSlice'
import Spinner from '../shared/Spinner/Spinner'
import styles from './GitHubLogin.module.scss'

export default function GitHubLogin() {
	const [trigger] = useLazyGitHubLoginQuery()
	const params = useSearchParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	useEffect(async () => {
		if (params.includes('code')) {
			let code = params['code']
			let { data, isSuccess } = await trigger(code)
			if (isSuccess) {
				dispatch(setToken(data.access_token))
			}
		} else {
			navigate('/login')
		}
	}, [])

	return (
		<div className={styles.Container}>
			<Spinner className={styles.Spinner} />
		</div>
	)
}
