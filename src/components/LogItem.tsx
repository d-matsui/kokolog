import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/styles";
import type { Log } from "../types";
import { formatLogDate } from "../utils/dateUtils";

type LogItemProps = {
	log: Log;
	onPress: (log: Log) => void;
};

export const LogItem = ({ log, onPress }: LogItemProps) => {
	const getMoodSummary = () => {
		if (log.beforeMoods.length === 0 && log.afterMoods.length === 0) {
			return "気分の記録なし";
		}

		const beforeEmojis = log.beforeMoods
			.map((mood) => `${mood.name}(${mood.level})`)
			.join(" ");
		const afterEmojis = log.afterMoods
			.map((mood) => `${mood.name}(${mood.level})`)
			.join(" ");

		if (beforeEmojis && afterEmojis) {
			return `${beforeEmojis} → ${afterEmojis}`;
		}
		if (beforeEmojis) {
			return `前: ${beforeEmojis}`;
		}
		return `後: ${afterEmojis}`;
	};

	return (
		<TouchableOpacity style={styles.logItem} onPress={() => onPress(log)}>
			<View style={styles.logItemHeader}>
				<Text style={styles.logDate}>{formatLogDate(log.date)}</Text>
				{log.isFavorite && (
					<Text style={styles.favoriteIconActive}>⭐</Text>
				)}
			</View>
			<Text style={styles.logThought} numberOfLines={2}>
				{log.situation}
			</Text>
			{log.autoThought && (
				<Text style={styles.logThought} numberOfLines={2}>
					💭 {log.autoThought}
				</Text>
			)}
			<Text style={styles.logThought}>{getMoodSummary()}</Text>
			{log.newThought && (
				<Text style={styles.logThought} numberOfLines={2}>
					💡 {log.newThought}
				</Text>
			)}
		</TouchableOpacity>
	);
};
