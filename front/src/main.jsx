import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import Router from './routes/Router'
import { Provider } from 'react-redux'
import { rootStore } from './store/rootStore'
import AuthWrapper from './components/AuthWrapper'

ReactDOM.render(
	<React.StrictMode>
		<Provider store={rootStore}>
			<AuthWrapper>
				<Router />
			</AuthWrapper>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
