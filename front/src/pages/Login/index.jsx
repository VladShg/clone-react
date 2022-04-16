import React from "react"
import styles from "./Login.module.scss"
import backgroundImage from "../../media/background/painted.png"
import classNames from "classnames"
import { Link } from "react-router-dom"

export default function Login() {
	return (
		<div className={styles.container}>
			<div className={styles.background}>
				<i className={classNames("fa-solid fa-crow", styles.backgroundLogo)} />
				<img src={backgroundImage} alt="wall" />
			</div>
			<div>
				<div className={styles.loginContainer}>
					<i className={classNames("fa-solid fa-crow", styles.logo)} />
					<h1>Happening now</h1>
					<h2>Join Twitter today.</h2>
					<Link to="/signup" className={styles.signupService}>
						Sign up with Google
					</Link>
					<Link to="/signup" className={styles.signupService}>
						Sign up with Apple
					</Link>
					<span className={styles.separator}>or</span>
					<Link to="/signup" className={styles.signupManual}>
						Sign up with phone or email
					</Link>
					<span className={styles.termsNotice}>
						By signing up, you agree to the Terms of Service and Privacy Policy,
						including Cookie Use.
					</span>
					<h3>Already have an account?</h3>
					<Link to="/signup" className={styles.signIn}>
						Sign in
					</Link>
				</div>
			</div>
		</div>
	)
}
