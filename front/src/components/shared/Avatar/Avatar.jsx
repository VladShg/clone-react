import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Avatar.module.scss'

Avatar.propTypes = {
	src: PropTypes.string,
	alignCenter: PropTypes.bool,
	alignBottom: PropTypes.bool,
}

export default function Avatar({
	src,
	className,
	alignCenter,
	alignBottom,
	size = 40,
}) {
	const classes = classNames(styles.Avatar, {
		[styles.center]: Boolean(alignCenter),
		[styles.bottom]: Boolean(alignBottom),
		[className]: !!className,
	})

	const style = { width: size + 'px', height: size + 'px' }

	return (
		<div className={classes}>
			{src && <img style={style} src={src} />}
			<div style={style} className={styles.Skeleton} />
		</div>
	)
}
