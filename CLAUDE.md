# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kokolog is a React Native mobile app built with Expo for practicing Cognitive Behavioral Therapy (CBT) using the 7-column method. The app helps users track thoughts, emotions, and cognitive patterns through structured journaling.

## Development Commands

### Primary Commands
- `npm start` - Start Expo development server
- `npm run android` - Start on Android device/emulator  
- `npm run ios` - Start on iOS device/simulator
- `npm run web` - Start web version

### Code Quality
- **Linting/Formatting**: Uses Biome (configured in `biome.json`)
  - Tab indentation, double quotes for JavaScript
  - Recommended rules enabled with organize imports
- **TypeScript**: Strict mode enabled with esModuleInterop

## Architecture Overview

### Core Data Flow
The app follows a centralized state management pattern using React Context:

1. **LogContext** (`src/context/LogContext.tsx`)
   - Primary state container
   - Manages all log entries with CRUD operations
   - Handles AsyncStorage persistence automatically
   - Provides loading states and error handling

2. **Data Model** (`src/types/index.ts`)
   - `Log`: Core entity containing 7-column CBT data (situation, moods, thoughts, evidence)
   - `Mood`: Emotional state with name and intensity level (1-5)
   - All logs have before/after mood states for tracking progress

3. **Navigation Pattern** (`App.tsx`)
   - Single-page app with view state management
   - Two main modes: "main" (tabbed interface) and "form" (full-screen editing)
   - Persistent quick memo state for rapid thought capture

### Screen Architecture

**Main Tabbed Interface:**
- `HomeScreen` - Quick memo input and form access
- `ListScreen` - Browse all log entries  
- `GraphScreen` - Mood visualization charts
- `KizukiScreen` - Favorited insights ("kizuki" = realizations)

**Form Interface:**
- `FormScreen` - Full 7-column CBT form with mood inputs
- Handles both new entry creation and editing existing logs

### Key Components

- **MoodInput** (`src/components/MoodInput.tsx`)
  - Multi-emotion selection with 5-level intensity rating
  - Uses emoji visualization from `emotions.ts` constants
  
- **FormInput** - Reusable text input with consistent styling

- **TabBar** - Bottom navigation between main screens

### Data Persistence

- **Storage Key**: `@kokoro_logs` in AsyncStorage
- **Auto-save**: Context automatically persists changes on state updates
- **Loading States**: Proper loading/error handling for async operations

## Development Notes

### Emotion System
Emotions are defined in `src/constants/emotions.ts` with Japanese labels and emoji mappings:
- イライラ (Irritation), 不安 (Anxiety), ゆううつ (Depression), etc.
- Each emotion uses 1-5 intensity levels displayed as emoji opacity

### State Management Patterns
- Use `useLogs()` hook to access log operations
- Form state is managed locally in components, then committed via context
- Quick memo state persists in App component across tab switches

### TypeScript Integration
- Strict typing throughout with proper interfaces
- Expo configuration enables new architecture features
- All async operations properly typed with error handling