import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './avatar.module.scss'

Avatar.propTypes = {
	src: PropTypes.string,
	alignCenter: PropTypes.bool,
	alignBottom: PropTypes.bool,
}

export default function Avatar({ src, alignCenter, alignBottom }) {
	const className = classNames(styles.avatar, {
		[styles.center]: Boolean(alignCenter),
		[styles.bottom]: Boolean(alignBottom),
	})

	return (
		<div className={className}>
			<img src={src} />
		</div>
	)
}
