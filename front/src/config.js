const config = {
	API_URL: import.meta.env.VITE_API_URL,
	SITE_URL: import.meta.env.VITE_APP_URL,
	google: {
		CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
	},
	github: {
		CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID,
	},
}

export default config
