module.exports = {
	extends: ['eslint:recommended', 'prettier'],
	env: {
		node: true,
		es6: true
	},
	parserOptions: {
		ecmaVersion: 6,
		ecmaFeatures: {
			experimentalObjectRestSpread: true
		}
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'error',
		'no-console': 'off',
		'no-case-declarations': 'off',
		'no-unused-vars': [
			1,
			{
				ignoreSiblings: true,
				argsIgnorePattern: 'res|e'
			}
		]
	}
};
