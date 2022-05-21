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
	image,
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
	if (image) {
		image = `data:image/png;base64, ${image}`
	}
	console.log(image)

	return (
		<div className={classes}>
			{image && <img style={style} src={image} />}
			<div style={style} className={styles.Skeleton} />
		</div>
	)
}
