import React from "react"
import ReactDOM from "react-dom"
import "./index.scss"
import { BrowserRouter } from "react-router-dom"
import AuthProvider from "./components/context/AuthContext"
import Home from "./pages/Home"

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<Home />
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
)
