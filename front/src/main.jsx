import React from "react"
import ReactDOM from "react-dom"
import "./index.scss"
import Router from "./routes/Router"
import { Provider } from "react-redux"
import { rootStore } from "./store/main"

ReactDOM.render(
	<React.StrictMode>
		<Provider store={rootStore}>
			<Router />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
)
