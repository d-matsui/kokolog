import { useState } from "react";
import { ActivityIndicator, Alert, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TabBar from "./src/components/TabBar";
import { LogProvider, useLogs } from "./src/context/LogContext";
import FormScreen from "./src/screens/FormScreen";
import GraphScreen from "./src/screens/GraphScreen";
import HomeScreen from "./src/screens/HomeScreen";
import KizukiScreen from "./src/screens/KizukiScreen";
import ListScreen from "./src/screens/ListScreen";
import { styles } from "./src/styles/styles";
import type { Log } from "./src/types";

function KokoroLogApp() {
	const [currentView, setCurrentView] = useState("main");
	const [activeTab, setActiveTab] = useState("home");
	const [editingLog, setEditingLog] = useState<Partial<Log> | null>(null);
	const [quickMemo, setQuickMemo] = useState("");

	const { isLoading, addLog, updateLog, deleteLog } = useLogs();

	const showFormScreen = (log?: Log | null) => {
		setEditingLog(log || { autoThought: quickMemo });
		setCurrentView("form");
	};
	const showMainView = () => {
		setEditingLog(null);
		setCurrentView("main");
	};

	const handleQuickSave = () => {
		if (quickMemo.trim() === "") return;
		const newLog = {
			autoThought: quickMemo,
			situation: "(未記入)",
			beforeMoods: [],
			afterMoods: [],
			evidence: "",
			counterEvidence: "",
			newThought: "",
			isFavorite: false,
		};
		addLog(newLog);
		setQuickMemo("");
		setActiveTab("list");
		Alert.alert("保存しました", "記録一覧から後で編集できます。");
	};

	const handleSaveLog = (logToSave: Log | Omit<Log, "id" | "date">) => {
		if ("id" in logToSave) {
			updateLog(logToSave);
		} else {
			addLog(logToSave);
		}
		setActiveTab("list");
		showMainView();
	};

	const handleDeleteLog = (logId: string) => {
		deleteLog(logId);
		showMainView();
	};

	if (isLoading) {
		return (
			<View style={[styles.container, styles.center]}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	const renderContent = () => {
		if (currentView === "form") {
			return (
				<FormScreen
					onGoBack={showMainView}
					onSave={handleSaveLog}
					onDelete={handleDeleteLog}
					initialLog={editingLog}
				/>
			);
		}

		let screen: React.ReactElement;
		switch (activeTab) {
			case "home":
				screen = (
					<HomeScreen
						quickMemo={quickMemo}
						setQuickMemo={setQuickMemo}
						onShowForm={showFormScreen}
						onQuickSave={handleQuickSave}
					/>
				);
				break;
			case "list":
				screen = <ListScreen onSelectLog={showFormScreen} />;
				break;
			case "graph":
				screen = <GraphScreen onSelectLog={showFormScreen} />;
				break;
			case "kizuki":
				screen = <KizukiScreen onSelectLog={showFormScreen} />;
				break;
			default:
				screen = (
					<HomeScreen
						quickMemo={quickMemo}
						setQuickMemo={setQuickMemo}
						onShowForm={showFormScreen}
						onQuickSave={handleQuickSave}
					/>
				);
		}
		return (
			<View style={{ flex: 1 }}>
				{screen}
				<TabBar activeTab={activeTab} onTabPress={setActiveTab} />
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />
			{renderContent()}
		</View>
	);
}

export default function App() {
	return (
		<SafeAreaProvider>
			<LogProvider>
				<KokoroLogApp />
			</LogProvider>
		</SafeAreaProvider>
	);
}
