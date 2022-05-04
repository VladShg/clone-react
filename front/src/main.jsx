import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import { Provider } from 'react-redux'
import { rootStore } from './store/rootStore'
import App from './App'

ReactDOM.render(
	<React.StrictMode>
		<Provider store={rootStore}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
