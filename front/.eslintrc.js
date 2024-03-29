module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:prettier/recommended',
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', 'prettier'],
	rules: {
		'prettier/prettier': 'warn',
		'arrow-body-style': 'off',
		'prefer-arrow-callback': 'off',
		'react/prop-types': 'off',
		'no-console': 'error',
	},
	ignorePatterns: ['.eslintrc.js'],
}
