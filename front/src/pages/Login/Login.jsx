import React from "react"
import styles from "./Login.module.scss"
import backgroundImage from "../../media/background/painted.png"
import classNames from "classnames"
import { Link } from "react-router-dom"
import GoogleLogin from "react-google-login"

export default function Login() {
	const onLogin = async (googleResponse) => {
		let request = await fetch("http://127.0.0.1:5000/auth/google/login/", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				token: googleResponse.accessToken,
			}),
		})
		let response = await request.json()
	}

	const onSignUp = async (googleResponse) => {
		let request = await fetch("http://127.0.0.1:5000/auth/google/signup/", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				token: googleResponse.accessToken,
				...googleResponse.profileObj,
			}),
		})
		let response = await request.json()
	}

	const logResponse = (data, context) => {
		console.log(data, context)
	}

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
					<h2>Join Crower today.</h2>
					<GoogleLogin
						clientId="30844922821-htjb9q45jeuvn95dapfkm2743s52eqoo.apps.googleusercontent.com"
						render={(renderProps) => (
							<button
								className={styles.signupService}
								onClick={renderProps.onClick}
								disabled={renderProps.disabled}
							>
								Sign up with Google
							</button>
						)}
						cookiePolicy={"single_host_origin"}
						onFailure={(data) => logResponse("failure", data)}
						onSuccess={onSignUp}
					/>
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
