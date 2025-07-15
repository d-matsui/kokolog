module.exports = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'babel-jest',
			{
				presets: [
					['@babel/preset-env', { targets: { node: 'current' } }],
					'@babel/preset-typescript',
					'@babel/preset-react',
				],
			},
		],
	},
	testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	transformIgnorePatterns: [
		'node_modules/(?!(react-native|@react-native|@react-native-async-storage|react-native-chart-kit|react-native-svg)/)',
	],
};