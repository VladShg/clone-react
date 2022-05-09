export function formatTimeDelta(time, now) {
	const hourDelta = (now.getTime() - time.getTime()) / 3600000
	if (hourDelta < 1) {
		const minuteDelta = (now.getTime() - time.getTime()) / 60000
		if (minuteDelta >= 1) {
			return `${Math.floor(minuteDelta)} m`
		} else {
			return 'now'
		}
	} else if (hourDelta < 24) {
		return `${Math.floor(hourDelta)} h`
	} else {
		return time.toLocaleDateString().slice(0, 5)
	}
}
