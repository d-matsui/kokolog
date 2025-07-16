import { ScrollView, Text, View } from "react-native";
import { LogItem } from "../components/LogItem";
import ScreenWrapper from "../components/ScreenWrapper";
import { useLogs } from "../context/LogContext";
import { styles } from "../styles/styles";
import type { Log } from "../types";

interface ListScreenProps {
	onSelectLog: (log: Log) => void;
}

const ListScreen = ({ onSelectLog }: ListScreenProps) => {
	const { logs } = useLogs();

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
						logs.map((log) => (
							<LogItem key={log.id} log={log} onPress={onSelectLog} />
						))
					)}
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};
export default ListScreen;
