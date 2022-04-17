import React from "react"
import ReactDOM from "react-dom"
import "./index.scss"
import AuthProvider from "./components/context/AuthContext"
import Router from "./Router"

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<Router />
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
)
