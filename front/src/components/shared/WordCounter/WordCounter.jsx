import React from 'react'
import PropTypes from 'prop-types'
import isPropValid from '@emotion/is-prop-valid'
import { styled } from '@mui/material'
import { theme } from '@utils/theme'

const StyledCircle = styled('circle', { shouldForwardProp: isPropValid })(
	({ radius, size }) => ({
		transition: '0.2s ease r',
		strokeWidth: '2px',
		strokeLinecap: 'round',
		fill: 'transparent',

		r: radius,
		cx: size / 2,
		cy: size / 2,
	})
)

export default function WordCounter({ text, size = 30, maxLength = 140 }) {
	const warningTreshold = 20
	let percentage = Math.round((text.length * 100) / maxLength)
	if (percentage > 100) {
		percentage = 100
	} else if (percentage < 0) {
		percentage = 0
	}

	let caption = null
	let hasCircle = true
	let circleColor = theme.palette.primary.main
	let textColor = theme.palette.common.black

	if (text.length >= maxLength) {
		caption = maxLength - text.length
		circleColor = theme.palette.error.main
		textColor = theme.palette.error.main
		if (text.length - maxLength >= 10) {
			hasCircle = false
		}
	} else if (text.length >= maxLength - warningTreshold) {
		caption = maxLength - text.length
		textColor = theme.palette.common.black
		circleColor = theme.palette.warning.main
	}

	let circleShrink = null
	if (!caption && text.length != maxLength) {
		circleShrink = 0.6
	}

	return (
		<svg width={size} height={size}>
			{hasCircle && (
				<g transform={`rotate(-90 ${`${size / 2} ${size / 2}`})`}>
					<Circle shrink={circleShrink} size={size} color="lightgrey" />
					<Circle
						shrink={circleShrink}
						size={size}
						color={circleColor}
						pct={percentage}
					/>
				</g>
			)}
			{caption && <Text content={caption} color={textColor} size={size} />}
		</svg>
	)
}

WordCounter.propTypes = {
	text: PropTypes.string.isRequired,
	size: PropTypes.number,
}

const Circle = ({ color, pct, size, shrink = 0.6 }) => {
	let radius = size / 2
	if (shrink) {
		radius *= shrink
	} else {
		radius -= 2
	}

	const circ = 2 * Math.PI * radius
	const strokePct = ((100 - pct) * circ) / 100
	return (
		<StyledCircle
			radius={radius}
			size={size}
			stroke={strokePct !== circ ? color : ''} // remove color as 0% sets full circumference
			strokeDasharray={circ}
			strokeDashoffset={pct ? strokePct : 0}
		></StyledCircle>
	)
}

Circle.propTypes = {
	pct: PropTypes.number,
	size: PropTypes.number.isRequired,
	color: PropTypes.string.isRequired,
	shrink: PropTypes.number,
}

const Text = ({ content, size, color }) => {
	return (
		<text
			dominantBaseline="central"
			textAnchor="middle"
			x="50%"
			y="50%"
			fill={color}
			fontSize={size / 2.5 + 'px'}
		>
			{content}
		</text>
	)
}

Text.propTypes = {
	content: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	size: PropTypes.number.isRequired,
}
