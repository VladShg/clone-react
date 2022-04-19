import React, { useState } from "react"
import styles from "./Login.module.scss"
import backgroundImage from "../../media/background/painted.png"
import classNames from "classnames"
import { Link } from "react-router-dom"
import GoogleLogin from "react-google-login"
import ModalConfirm from "../../components/shared/ModalConfirm/ModalConfirm"
import { API_URL, CLIENT_ID } from "../../config"

export default function Login() {
	const [isModalOpen, setModalOpen] = useState(false)

	const onLogin = async (googleResponse) => {
		let request = await fetch(`{API_URL}/auth/google/login/`, {
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
		let request = await fetch(`${API_URL}/auth/google/signup/`, {
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
						clientId={CLIENT_ID}
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
					<ModalConfirm isOpen={isModalOpen} setOpen={setModalOpen}>
						<h1>hello</h1>
					</ModalConfirm>
				</div>
			</div>
		</div>
	)
}
