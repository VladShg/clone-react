import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Avatar.module.scss'

Avatar.propTypes = {
	src: PropTypes.string,
	alignCenter: PropTypes.bool,
	alignBottom: PropTypes.bool,
}

export default function Avatar({ src, alignCenter, alignBottom }) {
	const className = classNames(styles.Avatar, {
		[styles.center]: Boolean(alignCenter),
		[styles.bottom]: Boolean(alignBottom),
	})

	return (
		<div className={className}>
			{src && <img src={src} />}
			<div className={styles.Skeleton} />
		</div>
	)
}
