export function base64decode(data) {
	return data ? `data:image/png;base64, ${data}` : ''
}