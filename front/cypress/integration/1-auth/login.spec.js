describe('Login page', () => {
	const username = 'Username'
	const name = 'Vlad Shulha'
	const birth = '2000-07-30'
	const email = 'email@mail.com'
	it('Sign up and log out', () => {
		cy.visit('/')
		cy.contains('Sign up with email').click()
		cy.get('input[name="name"]').type(name)
		cy.get('input[name="email"]').type(email)
		cy.get('input[type=date]').type(birth)
		cy.contains('Next').should('not.be', 'disabled')
		cy.contains('Next').click()

		cy.get('input[placeholder=Username]').type(username)
		cy.contains('Next').should('not.be', 'disabled')
		cy.contains('Next').click()

		cy.contains('Skip').should('not.be', 'disabled')
		cy.contains('Skip').click()

		cy.get('input[placeholder=Password]').type('password')
		cy.get('input[placeholder="Confirm password"]').type('password')
		cy.contains('Submit').should('not.be', 'disabled')
		cy.contains('Submit').click()

		cy.contains('@' + username).should('exist')
		cy.contains(name).should('exist')

		cy.get('span[class*="Username"]:visible').should('contain', '@' + username)
		cy.get('span[class*="Username"]:visible').click()
		cy.contains('Log out').click()

		cy.contains('Sign up with email').should('exist')
	})
})
