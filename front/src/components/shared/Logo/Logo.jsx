import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { styled } from '@mui/material/styles'

export const BackgroundLogo = styled(FontAwesomeIcon)(({ theme }) => ({
	color: theme.palette.common.white,
	position: 'absolute',
	top: '50%',
	left: '50%',
	fontSize: '320px',
	transform: 'translateX(-50%) translateY(-50%)',
}))

export const SubtleLogo = styled(FontAwesomeIcon)(({ theme }) => ({
	color: theme.palette.primary.main,
	fontSize: '32px',
}))
