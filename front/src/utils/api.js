import config from '../config'

async function vaildateProfile(params) {
	let response = await fetch(`${config.API_URL}/auth/lookup` + params)
	if (response.ok) {
		const body = await response.json()
		return body.isAvailable
	}
	return false
}

export async function validateEmail(email) {
	const params = '?' + new URLSearchParams({ email })
	return await vaildateProfile(params)
}

export async function validateUsername(username) {
	const params = '?' + new URLSearchParams({ username })
	return await vaildateProfile(params)
}
