import {
	useGetAvatarQuery,
	useGetBackgroundQuery,
	useGetUserQuery,
} from '@services/userApi'

export default function useProfile(
	username = '',
	params = {
		avatar: true,
		background: true,
	}
) {
	const { data: data, isLoading: isUserLoading } = useGetUserQuery(username, {
		skip: !username,
	})
	const { data: avatar, isLoading: isAvatarLoading } = useGetAvatarQuery(
		username,
		{
			skip: !username || !params?.avatar,
		}
	)
	const { data: background, isLoading: isBackgroundLoading } =
		useGetBackgroundQuery(username, {
			skip: !username || !params?.background,
		})

	const isLoading = isUserLoading || isAvatarLoading || isBackgroundLoading
	const user = { ...data, avatar, background }

	return { user, isLoading }
}
