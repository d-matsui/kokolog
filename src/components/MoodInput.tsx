import { Text, TouchableOpacity, View } from "react-native";
import { EMOTION_TAGS, EMOTIONS } from "../constants/emotions";
import { styles } from "../styles/styles";
import type { Mood } from "../types";

interface MoodInputProps {
	label: string;
	moods: Mood[];
	setMoods: (moods: Mood[]) => void;
}

const MoodInput = ({ label, moods, setMoods }: MoodInputProps) => {
	const addMood = (name: string) => {
		if (!moods.some((m) => m.name === name))
			setMoods([...moods, { name, level: 3 }]);
	};
	const updateMoodLevel = (name: string, level: number) =>
		setMoods(moods.map((m) => (m.name === name ? { ...m, level } : m)));
	const removeMood = (name: string) =>
		setMoods(moods.filter((m) => m.name !== name));
	return (
		<View style={styles.inputGroup}>
			<Text style={styles.formLabel}>{label}</Text>
			<View style={styles.moodsWrapper}>
				{moods.map((mood) => (
					<View key={mood.name} style={styles.moodInputRow}>
						<Text style={styles.moodName}>{mood.name}</Text>
						<View style={styles.levelSelector}>
							{[1, 2, 3, 4, 5].map((level) => (
								<TouchableOpacity
									key={level}
									onPress={() => updateMoodLevel(mood.name, level)}
								>
									<Text
										style={[
											styles.levelEmoji,
											{ opacity: mood.level >= level ? 1 : 0.3 },
										]}
									>
										{EMOTIONS[mood.name]}
									</Text>
								</TouchableOpacity>
							))}
						</View>
						<TouchableOpacity
							onPress={() => removeMood(mood.name)}
							style={styles.removeButton}
						>
							<Text style={styles.removeButtonText}>×</Text>
						</TouchableOpacity>
					</View>
				))}
			</View>
			<View style={styles.tagContainer}>
				{EMOTION_TAGS.map((tag) => (
					<TouchableOpacity
						key={tag}
						style={styles.tag}
						onPress={() => addMood(tag)}
					>
						<Text style={styles.tagText}>+ {tag}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};
export default MoodInput;
