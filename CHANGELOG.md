# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Semantic versioning with automated release workflow
- Comprehensive test suite with 97.89% coverage
- CI/CD pipeline with GitHub Actions
- Claude integration for automated development workflow
- TypeScript support with strict mode
- Biome for code formatting and linting

### Changed
- Improved CI workflow by removing external dependencies
- Updated README with comprehensive documentation

### Fixed
- CI workflow exit code 255 by removing problematic Codecov step
- TypeScript type safety issues in test files

## [1.0.0] - 2024-07-16

### Added
- Initial release of Kokolog CBT app
- 7-column CBT form implementation
- Multi-dimensional emotion tracking system
- Quick memo functionality
- Mood visualization with charts
- Local data persistence with AsyncStorage
- Favorite insights bookmarking
- Cross-platform React Native app with Expo

### Features
- **7コラム法記録フォーム**: Complete CBT 7-column method form
- **多次元感情記録**: Multi-emotion tracking with 5-level intensity
- **気分グラフ**: Visual mood tracking with charts
- **クイックメモ**: Quick thought capture functionality
- **大切な気づき**: Bookmark important insights
- **データ永続化**: Local data storage and management

### Technical Stack
- React Native with Expo SDK 53
- TypeScript for type safety
- React Context API for state management
- AsyncStorage for data persistence
- react-native-chart-kit for data visualization
- Jest and React Native Testing Library for testing