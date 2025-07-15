module.exports = {
	testEnvironment: 'node', // Better for React Native testing
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
	// ✅ Add these improvements:
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/__tests__/**',
		'!src/types/**',
		'!src/constants/**',
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	testTimeout: 10000,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};