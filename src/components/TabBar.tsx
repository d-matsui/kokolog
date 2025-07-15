import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/styles";

interface TabBarProps {
	activeTab: string;
	onTabPress: (tab: string) => void;
}

const TabBar = ({ activeTab, onTabPress }: TabBarProps) => {
	const insets = useSafeAreaInsets();
	return (
		<View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
			<TouchableOpacity
				style={styles.tabItem}
				onPress={() => onTabPress("home")}
			>
				<Text
					style={[styles.tabText, activeTab === "home" && styles.tabTextActive]}
				>
					ホーム
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.tabItem}
				onPress={() => onTabPress("list")}
			>
				<Text
					style={[styles.tabText, activeTab === "list" && styles.tabTextActive]}
				>
					一覧
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.tabItem}
				onPress={() => onTabPress("graph")}
			>
				<Text
					style={[
						styles.tabText,
						activeTab === "graph" && styles.tabTextActive,
					]}
				>
					分析
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.tabItem}
				onPress={() => onTabPress("kizuki")}
			>
				<Text
					style={[
						styles.tabText,
						activeTab === "kizuki" && styles.tabTextActive,
					]}
				>
					気づき
				</Text>
			</TouchableOpacity>
		</View>
	);
};
export default TabBar;
