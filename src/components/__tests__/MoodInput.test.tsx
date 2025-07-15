import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MoodInput from '../MoodInput';
import type { Mood } from '../../types';

// Mock the constants
jest.mock('../../constants/emotions', () => ({
	EMOTIONS: {
		'イライラ': '😠',
		'不安': '😥',
		'ゆううつ': '😞',
		'焦り': '😰',
		'虚しさ': '🫥',
		'無気力': '😮‍💨',
	},
	EMOTION_TAGS: ['イライラ', '不安', 'ゆううつ', '焦り', '虚しさ', '無気力'],
}));

describe('MoodInput', () => {
	const mockSetMoods = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockMoods: Mood[] = [
		{ name: 'イライラ', level: 3 },
		{ name: '不安', level: 2 },
	];

	describe('component structure', () => {
		it('should render without crashing', () => {
			const { getByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={[]}
					setMoods={mockSetMoods}
				/>
			);

			expect(getByText('気分 (記入前)')).toBeTruthy();
		});

		it('should render with selected moods', () => {
			const { getByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={mockMoods}
					setMoods={mockSetMoods}
				/>
			);

			expect(getByText('気分 (記入前)')).toBeTruthy();
		});
	});

	describe('mood management logic', () => {
		it('should add mood when emotion button is pressed', () => {
			const { getByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={[]}
					setMoods={mockSetMoods}
				/>
			);

			fireEvent.press(getByText('+ イライラ'));

			expect(mockSetMoods).toHaveBeenCalledWith([
				{ name: 'イライラ', level: 3 }
			]);
		});

		it('should not add duplicate mood', () => {
			const { getByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={mockMoods}
					setMoods={mockSetMoods}
				/>
			);

			fireEvent.press(getByText('+ イライラ'));

			expect(mockSetMoods).not.toHaveBeenCalled();
		});
	});
});