import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import faker from "@faker-js/faker"

export const AuthContext = React.createContext("")

AuthProvider.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
}

export default function AuthProvider(props) {
	const [user, setUser] = useState({})

	useEffect(() => {
		setUser({
			name: faker.name.findName(),
			username: faker.name.firstName(),
			avatar: faker.image.avatar(),
		})
	}, [])

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{props.children}
		</AuthContext.Provider>
	)
}
