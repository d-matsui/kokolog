import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { useLogs } from "../context/LogContext";
import { styles } from "../styles/styles";
import type { Log } from "../types";

interface KizukiScreenProps {
	onSelectLog: (log: Log) => void;
}

const KizukiScreen = ({ onSelectLog }: KizukiScreenProps) => {
	const { logs } = useLogs();
	const favoriteLogs = logs.filter((log) => log.isFavorite);

	return (
		<ScreenWrapper noPadding>
			<View style={styles.screen}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>大切な気づき</Text>
				</View>
				<ScrollView style={styles.listContainer}>
					{favoriteLogs.length === 0 ? (
						<Text style={styles.emptyText}>
							まだ「大切な気づき」がありません。
						</Text>
					) : (
						favoriteLogs.map((log) => {
							const d = new Date(log.date);
							const formattedDate = `${d.getFullYear()}年${
								d.getMonth() + 1
							}月${d.getDate()}日の記録より`;
							return (
								<TouchableOpacity
									key={log.id}
									style={styles.kizukiCard}
									onPress={() => onSelectLog(log)}
								>
									<Text style={styles.kizukiText}>{log.newThought}</Text>
									<Text style={styles.kizukiDate}>{formattedDate}</Text>
								</TouchableOpacity>
							);
						})
					)}
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};
export default KizukiScreen;
