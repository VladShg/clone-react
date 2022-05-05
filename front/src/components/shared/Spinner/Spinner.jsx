import React from 'react'
import classNames from 'classnames'
import styles from './Spinner.module.scss'
import { SpinnerCircular } from 'spinners-react'

export default function Spinner({ className, ...props }) {
	let classes = classNames(styles.Spinner, { [className]: !!className })
	return <SpinnerCircular className={classes} {...props} />
}
