import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { EMOTIONS } from "../constants/emotions";
import { useLogs } from "../context/LogContext";
import { styles } from "../styles/styles";
import type { Log } from "../types";

interface ListScreenProps {
	onSelectLog: (log: Log) => void;
}

const ListScreen = ({ onSelectLog }: ListScreenProps) => {
	const { logs, toggleFavorite } = useLogs();

	return (
		<ScreenWrapper noPadding>
			<View style={styles.screen}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>記録一覧</Text>
				</View>
				<ScrollView style={styles.listContainer}>
					{logs.length === 0 ? (
						<Text style={styles.emptyText}>まだ記録がありません。</Text>
					) : (
						logs.map((log) => {
							const d = new Date(log.date);
							const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
							const time = `${String(d.getHours()).padStart(
								2,
								"0",
							)}:${String(d.getMinutes()).padStart(2, "0")}`;
							const formattedDate = `${d.getFullYear()}年${
								d.getMonth() + 1
							}月${d.getDate()}日(${weekdays[d.getDay()]}) ${time}`;
							return (
								<TouchableOpacity
									key={log.id}
									style={styles.logItem}
									onPress={() => onSelectLog(log)}
								>
									<View style={styles.logItemHeader}>
										<Text style={styles.logDate}>{formattedDate}</Text>
										<TouchableOpacity
											onPress={() => toggleFavorite(log.id)}
											style={styles.logFavoriteButton}
										>
											<Text
												style={
													log.isFavorite
														? styles.favoriteIconActive
														: styles.favoriteIcon
												}
											>
												★
											</Text>
										</TouchableOpacity>
									</View>
									<Text style={styles.logThought}>{log.autoThought}</Text>
									<View style={styles.moodContainer}>
										<View style={{ flex: 1 }}>
											{log.beforeMoods?.map((mood) => (
												<Text key={mood.name} style={styles.moodText}>
													{EMOTIONS[mood.name]?.repeat(mood.level)} {mood.name}
												</Text>
											))}
										</View>
										<Text style={styles.moodArrow}>&rarr;</Text>
										<View style={{ flex: 1 }}>
											{log.afterMoods?.map((mood) => (
												<Text key={mood.name} style={styles.moodText}>
													{EMOTIONS[mood.name]?.repeat(mood.level)} {mood.name}
												</Text>
											))}
										</View>
									</View>
								</TouchableOpacity>
							);
						})
					)}
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};
export default ListScreen;
