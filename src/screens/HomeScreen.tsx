import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { useLogs } from "../context/LogContext";
import { styles } from "../styles/styles";

interface HomeScreenProps {
	quickMemo: string;
	setQuickMemo: (text: string) => void;
	onShowForm: (log?: null) => void;
	onQuickSave: () => void;
}

const HomeScreen = ({
	quickMemo,
	setQuickMemo,
	onShowForm,
	onQuickSave,
}: HomeScreenProps) => {
	const { clearAllLogs } = useLogs();
	const confirmClear = () =>
		Alert.alert("データの完全消去", "本当にすべてのデータを削除しますか？", [
			{ text: "キャンセル", style: "cancel" },
			{ text: "クリアする", style: "destructive", onPress: clearAllLogs },
		]);

	return (
		<ScreenWrapper noPadding>
			<View style={styles.screen}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>ホーム</Text>
				</View>
				<View style={styles.homeContent}>
					<Text style={styles.label}>いま、どんな考えが浮かびましたか？</Text>
					<TextInput
						style={[styles.textarea, { minHeight: 120 }]}
						placeholder="例：「どうせ自分は評価されていないんだ」"
						multiline
						value={quickMemo}
						onChangeText={setQuickMemo}
					/>
				</View>
				<View style={styles.footer}>
					<TouchableOpacity
						style={[styles.button, styles.grayButton]}
						onPress={onQuickSave}
					>
						<Text style={styles.buttonTextGray}>とりあえず保存</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.button, styles.blueButton]}
						onPress={() => onShowForm()}
					>
						<Text style={styles.buttonTextWhite}>7コラムを書く</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.clearButton} onPress={confirmClear}>
						<Text style={styles.clearButtonText}>全データクリア（開発用）</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScreenWrapper>
	);
};

export default HomeScreen;
