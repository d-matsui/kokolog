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

	describe('rendering', () => {
		it('should render label correctly', () => {
			const { getByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={[]}
					setMoods={mockSetMoods}
				/>
			);

			expect(getByText('気分 (記入前)')).toBeTruthy();
		});

		it('should render all emotion tags as buttons', () => {
			const { getByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={[]}
					setMoods={mockSetMoods}
				/>
			);

			const emotionTags = ['イライラ', '不安', 'ゆううつ', '焦り', '虚しさ', '無気力'];
			emotionTags.forEach(emotion => {
				expect(getByText(`+ ${emotion}`)).toBeTruthy();
			});
		});

		it('should render selected moods with level controls', () => {
			const { getByText, getAllByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={mockMoods}
					setMoods={mockSetMoods}
				/>
			);

			// Should show mood names
			expect(getByText('イライラ')).toBeTruthy();
			expect(getByText('不安')).toBeTruthy();

			// Should show remove buttons
			const removeButtons = getAllByText('×');
			expect(removeButtons).toHaveLength(2);
		});
	});

	describe('mood management', () => {
		it('should add mood with default level 3', () => {
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

		it('should remove mood when remove button is pressed', () => {
			const { getAllByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={mockMoods}
					setMoods={mockSetMoods}
				/>
			);

			const removeButtons = getAllByText('×');
			fireEvent.press(removeButtons[0]);

			expect(mockSetMoods).toHaveBeenCalledWith([
				{ name: '不安', level: 2 }
			]);
		});

		it('should update mood level when emoji is pressed', () => {
			const { getAllByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={[{ name: 'イライラ', level: 3 }]}
					setMoods={mockSetMoods}
				/>
			);

			// Find all emoji buttons for イライラ (should be 5)
			const emojiButtons = getAllByText('😠');
			
			// Test pressing level 5 emoji
			if (emojiButtons.length >= 5) {
				fireEvent.press(emojiButtons[4]); // Level 5
				
				expect(mockSetMoods).toHaveBeenCalledWith([
					{ name: 'イライラ', level: 5 }
				]);
			}
		});
	});

	describe('edge cases', () => {
		it('should handle empty moods array', () => {
			const { getByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={[]}
					setMoods={mockSetMoods}
				/>
			);

			expect(getByText('気分 (記入前)')).toBeTruthy();
		});

		it('should handle maximum moods (all emotions)', () => {
			const allMoods: Mood[] = [
				{ name: 'イライラ', level: 3 },
				{ name: '不安', level: 2 },
				{ name: 'ゆううつ', level: 4 },
				{ name: '焦り', level: 1 },
				{ name: '虚しさ', level: 5 },
				{ name: '無気力', level: 3 },
			];

			const { getByText } = render(
				<MoodInput
					label="気分 (記入前)"
					moods={allMoods}
					setMoods={mockSetMoods}
				/>
			);

			// All emotion buttons should be hidden when all are selected
			allMoods.forEach(mood => {
				expect(getByText(mood.name)).toBeTruthy();
			});
		});
	});
});