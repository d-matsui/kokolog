// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
	getAllKeys: jest.fn(),
}));

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
	BarChart: 'BarChart',
	LineChart: 'LineChart',
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
	Svg: 'Svg',
	Path: 'Path',
	G: 'G',
	Rect: 'Rect',
	Text: 'Text',
}));

// Mock react-native components
jest.mock('react-native', () => ({
	View: 'View',
	Text: 'Text',
	TextInput: 'TextInput',
	TouchableOpacity: 'TouchableOpacity',
	ScrollView: 'ScrollView',
	ActivityIndicator: 'ActivityIndicator',
	StyleSheet: {
		create: jest.fn((styles) => styles),
		flatten: jest.fn((styles) => styles),
	},
	Alert: {
		alert: jest.fn(),
	},
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
	SafeAreaProvider: ({ children }) => children,
	useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock StatusBar
jest.mock('expo-status-bar', () => ({
	StatusBar: 'StatusBar',
}));

// Silence console warnings during tests
global.console = {
	...console,
	warn: jest.fn(),
	error: jest.fn(),
};