import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";

const EMOTIONS = {
	イライラ: "😠",
	不安: "😥",
	ゆううつ: "😞",
	焦り: "😰",
	虚しさ: "🫥",
	無気力: "😮‍💨",
};
const EMOTION_TAGS = Object.keys(EMOTIONS);
const MAX_MOOD_LEVEL = 5;
const BAR_HEIGHT_MULTIPLIER = 22;

const LogContext = createContext();

const LogProvider = ({ children }) => {
	const [logs, setLogs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadLogs = async () => {
			try {
				const jsonValue = await AsyncStorage.getItem("@kokoro_logs");
				if (jsonValue !== null) setLogs(JSON.parse(jsonValue));
			} catch (_e) {
				setLogs([]);
			} finally {
				setIsLoading(false);
			}
		};
		loadLogs();
	}, []);

	useEffect(() => {
		if (!isLoading) {
			const saveLogs = async () => {
				try {
					await AsyncStorage.setItem("@kokoro_logs", JSON.stringify(logs));
				} catch (e) {
					console.error("ログの保存に失敗しました。", e);
				}
			};
			saveLogs();
		}
	}, [logs, isLoading]);

	const addLog = (log) => {
		const newLog = {
			...log,
			id: Date.now().toString(),
			date: new Date().toISOString(),
		};
		setLogs([newLog, ...logs]);
	};

	const updateLog = (logToUpdate) => {
		const updatedLog = { ...logToUpdate, date: new Date().toISOString() };
		setLogs(logs.map((log) => (log.id === updatedLog.id ? updatedLog : log)));
	};

	const deleteLog = (logId) => {
		setLogs(logs.filter((log) => log.id !== logId));
	};

	const toggleFavorite = (logId) => {
		setLogs(
			logs.map((log) =>
				log.id === logId ? { ...log, isFavorite: !log.isFavorite } : log,
			),
		);
	};

	const clearAllLogs = async () => {
		try {
			await AsyncStorage.removeItem("@kokoro_logs");
			setLogs([]);
			Alert.alert("完了", "すべてのデータを削除しました。");
		} catch (_e) {
			Alert.alert("エラー", "データの削除に失敗しました。");
		}
	};

	const value = {
		logs,
		isLoading,
		addLog,
		updateLog,
		deleteLog,
		toggleFavorite,
		clearAllLogs,
	};

	return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
};

function KokoroLogApp() {
	const [currentView, setCurrentView] = useState("main");
	const [activeTab, setActiveTab] = useState("home");
	const [editingLog, setEditingLog] = useState(null);
	const [quickMemo, setQuickMemo] = useState("");

	const { isLoading, addLog, updateLog, deleteLog } = useContext(LogContext);

	const showFormScreen = (log) => {
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

	const handleSaveLog = (logToSave) => {
		if (logToSave.id) {
			updateLog(logToSave);
		} else {
			addLog(logToSave);
		}
		setActiveTab("list");
		showMainView();
	};

	const handleDeleteLog = (logId) => {
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

		let screen;
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
				screen = <HomeScreen />;
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

const ScreenWrapper = ({ children, noPadding = false }) => {
	const insets = useSafeAreaInsets();
	return (
		<View
			style={{
				flex: 1,
				paddingTop: insets.top,
				paddingBottom: noPadding ? 0 : insets.bottom,
				paddingLeft: insets.left,
				paddingRight: insets.right,
			}}
		>
			{children}
		</View>
	);
};
const FormInput = ({
	label,
	value,
	onChangeText,
	placeholder,
	multiline = false,
}) => (
	<View style={styles.inputGroup}>
		<Text style={styles.formLabel}>{label}</Text>
		<TextInput
			style={multiline ? styles.textarea : styles.input}
			value={value}
			onChangeText={onChangeText}
			placeholder={placeholder}
			multiline={multiline}
		/>
	</View>
);
const MoodInput = ({ label, moods, setMoods }) => {
	const addMood = (name) => {
		if (!moods.some((m) => m.name === name))
			setMoods([...moods, { name, level: 3 }]);
	};
	const updateMoodLevel = (name, level) =>
		setMoods(moods.map((m) => (m.name === name ? { ...m, level } : m)));
	const removeMood = (name) => setMoods(moods.filter((m) => m.name !== name));
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
const TabBar = ({ activeTab, onTabPress }) => {
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
const HomeScreen = ({ quickMemo, setQuickMemo, onShowForm, onQuickSave }) => {
	const { clearAllLogs } = useContext(LogContext);
	const confirmClear = () =>
		Alert.alert("データの完全消去", "本当にすべてのデータを削除しますか？", [
			{ text: "キャンセル" },
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
						onPress={onShowForm}
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
const FormScreen = ({ onGoBack, onSave, onDelete, initialLog }) => {
	const [situation, setSituation] = useState(initialLog?.situation || "");
	const [beforeMoods, setBeforeMoods] = useState(initialLog?.beforeMoods || []);
	const [autoThought, setAutoThought] = useState(initialLog?.autoThought || "");
	const [evidence, setEvidence] = useState(initialLog?.evidence || "");
	const [counterEvidence, setCounterEvidence] = useState(
		initialLog?.counterEvidence || "",
	);
	const [newThought, setNewThought] = useState(initialLog?.newThought || "");
	const [afterMoods, setAfterMoods] = useState(initialLog?.afterMoods || []);
	const [isFavorite, setIsFavorite] = useState(initialLog?.isFavorite || false);
	const isEditing = !!initialLog?.id;
	const handleSave = () =>
		onSave({
			...initialLog,
			situation,
			beforeMoods,
			autoThought,
			evidence,
			counterEvidence,
			newThought,
			afterMoods,
			isFavorite,
		});
	const confirmDelete = () => {
		if (initialLog?.id)
			Alert.alert("記録の削除", "この記録を本当に削除しますか？", [
				{ text: "キャンセル" },
				{
					text: "削除する",
					onPress: () => onDelete(initialLog.id),
					style: "destructive",
				},
			]);
	};
	return (
		<ScreenWrapper>
			<View style={styles.screen}>
				<View style={styles.header_form}>
					<View style={styles.headerLeft}>
						<TouchableOpacity onPress={onGoBack}>
							<Text style={styles.headerActionText}>〈</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.headerCenter}>
						<Text style={styles.headerTitle}>
							{isEditing ? "記録の編集" : "コラム作成"}
						</Text>
					</View>
					<View style={styles.headerRight}>
						<TouchableOpacity onPress={handleSave}>
							<Text style={styles.headerActionTextBold}>
								{isEditing ? "更新" : "保存"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<ScrollView
					style={styles.formContainer}
					showsVerticalScrollIndicator={false}
				>
					<FormInput
						label="状況"
						value={situation}
						onChangeText={setSituation}
						placeholder="例：朝の会議で発言できなかった"
						multiline
					/>
					<MoodInput
						label="気分 (記入前)"
						moods={beforeMoods}
						setMoods={setBeforeMoods}
					/>
					<FormInput
						label="自動思考"
						value={autoThought}
						onChangeText={setAutoThought}
						placeholder="例：「どうせ自分は評価されていないんだ」"
						multiline
					/>
					<FormInput
						label="根拠"
						value={evidence}
						onChangeText={setEvidence}
						placeholder="例：誰も自分の意見に賛同してくれなかった"
						multiline
					/>
					<FormInput
						label="反証"
						value={counterEvidence}
						onChangeText={setCounterEvidence}
						placeholder="例：Aさんは後で「良い意見だね」と言ってくれた"
						multiline
					/>
					<View>
						<FormInput
							label="バランスの取れた考え"
							value={newThought}
							onChangeText={setNewThought}
							placeholder="例：全員が賛同しなくても、意見を言うこと自体に価値がある"
							multiline
						/>
						<TouchableOpacity
							style={styles.favoriteButton}
							onPress={() => setIsFavorite(!isFavorite)}
						>
							<Text
								style={
									isFavorite ? styles.favoriteIconActive : styles.favoriteIcon
								}
							>
								★
							</Text>
							<Text style={styles.favoriteButtonText}>大切な気づき</Text>
						</TouchableOpacity>
					</View>
					<MoodInput
						label="気分 (記入後)"
						moods={afterMoods}
						setMoods={setAfterMoods}
					/>
					{isEditing && (
						<TouchableOpacity
							style={[styles.button, styles.redButton]}
							onPress={confirmDelete}
						>
							<Text style={styles.buttonTextWhite}>この記録を削除する</Text>
						</TouchableOpacity>
					)}
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};
const ListScreen = ({ onSelectLog }) => {
	const { logs, toggleFavorite } = useContext(LogContext);
	return (
		<ScreenWrapper noPadding>
			<View style={styles.screen}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>記録一覧</Text>
				</View>
				<ScrollView style={styles.listContainer}>
					{logs.length === 0
						? <Text style={styles.emptyText}>まだ記録がありません。</Text>
						: logs.map((log) => {
								const d = new Date(log.date);
								const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
								const time = `${String(d.getHours()).padStart(2, "0")}:${String(
									d.getMinutes(),
								).padStart(2, "0")}`;
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
														{EMOTIONS[mood.name]?.repeat(mood.level)}{" "}
														{mood.name}
													</Text>
												))}
											</View>
											<Text style={styles.moodArrow}>&rarr;</Text>
											<View style={{ flex: 1 }}>
												{log.afterMoods?.map((mood) => (
													<Text key={mood.name} style={styles.moodText}>
														{EMOTIONS[mood.name]?.repeat(mood.level)}{" "}
														{mood.name}
													</Text>
												))}
											</View>
										</View>
									</TouchableOpacity>
								);
							})}
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};
const GraphScreen = ({ onSelectLog }) => {
	const { logs } = useContext(LogContext);

	const availableEmotions = useMemo(
		() => [
			...new Set(
				logs.flatMap((log) =>
					[...(log.beforeMoods || []), ...(log.afterMoods || [])].map(
						(m) => m.name,
					),
				),
			),
		],
		[logs],
	);

	const [selectedEmotion, setSelectedEmotion] = useState(null);

	useEffect(() => {
		if (!selectedEmotion && availableEmotions.length > 0) {
			setSelectedEmotion(availableEmotions[0]);
		}
	}, [availableEmotions, selectedEmotion]);
	const filteredLogs = selectedEmotion
		? logs
				.filter(
					(log) =>
						log.beforeMoods?.some((m) => m.name === selectedEmotion) ||
						log.afterMoods?.some((m) => m.name === selectedEmotion),
				)
				.sort((a, b) => new Date(a.date) - new Date(b.date))
				.slice(-7)
		: [];
	return (
		<ScreenWrapper noPadding>
			<View style={styles.screen}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>気分グラフ</Text>
				</View>
				<View>
					<Text style={styles.formLabel}>感情を選択してください:</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.tagContainer}
					>
						{availableEmotions.map((emotion) => (
							<TouchableOpacity
								key={emotion}
								style={[
									styles.tag,
									selectedEmotion === emotion && styles.tagSelected,
								]}
								onPress={() => setSelectedEmotion(emotion)}
							>
								<Text
									style={[
										styles.tagText,
										selectedEmotion === emotion && styles.tagTextSelected,
									]}
								>
									{EMOTIONS[emotion]} {emotion}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>
				<View style={styles.chartContainer}>
					{filteredLogs.length > 0
						? <View style={styles.chartWrapper}>
								<View style={styles.yAxisContainer}>
									{[...Array(MAX_MOOD_LEVEL)].map((_, i) => {
										const labelValue = MAX_MOOD_LEVEL - i;
										return (
											<Text
												key={`yAxisLabel-${labelValue}`}
												style={styles.yAxisLabel}
											>
												{labelValue}
											</Text>
										);
									})}
								</View>
								<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.barChart}
								>
									{filteredLogs.map((log) => {
										const beforeMood = log.beforeMoods.find(
											(m) => m.name === selectedEmotion,
										);
										const afterMood = log.afterMoods.find(
											(m) => m.name === selectedEmotion,
										);
										const beforeLevel = beforeMood
											? parseInt(beforeMood.level, 10)
											: 0;
										const afterLevel = afterMood
											? parseInt(afterMood.level, 10)
											: 0;
										const d = new Date(log.date);
										const dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;
										return (
											<TouchableOpacity
												key={log.id}
												style={styles.barGroup}
												onPress={() => onSelectLog(log)}
											>
												<View style={styles.barWrapper}>
													<View
														style={[
															styles.bar,
															styles.barBefore,
															{ height: beforeLevel * BAR_HEIGHT_MULTIPLIER },
														]}
													/>
													<View
														style={[
															styles.bar,
															styles.barAfter,
															{ height: afterLevel * BAR_HEIGHT_MULTIPLIER },
														]}
													/>
												</View>
												<Text style={styles.barLabel}>{dateLabel}</Text>
											</TouchableOpacity>
										);
									})}
								</ScrollView>
							</View>
						: <Text style={styles.emptyText}>
								表示するデータがありません。
							</Text>}
					<View style={styles.legendContainer}>
						<View style={styles.legendItem}>
							<View style={[styles.legendColor, styles.barBefore]} />
							<Text>記入前</Text>
						</View>
						<View style={styles.legendItem}>
							<View style={[styles.legendColor, styles.barAfter]} />
							<Text>記入後</Text>
						</View>
					</View>
				</View>
			</View>
		</ScreenWrapper>
	);
};
const KizukiScreen = ({ onSelectLog }) => {
	const { logs } = useContext(LogContext);
	const favoriteLogs = logs.filter((log) => log.isFavorite);
	return (
		<ScreenWrapper noPadding>
			<View style={styles.screen}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>大切な気づき</Text>
				</View>
				<ScrollView style={styles.listContainer}>
					{favoriteLogs.length === 0
						? <Text style={styles.emptyText}>
								まだ「大切な気づき」がありません。
							</Text>
						: favoriteLogs.map((log) => {
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
							})}
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#fff" },
	center: { justifyContent: "center", alignItems: "center" },
	screen: {
		flex: 1,
		paddingHorizontal: 20,
		paddingBottom: 20,
		backgroundColor: "#f8f9fa",
	},
	header: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
		marginBottom: 10,
	},
	header_form: {
		flexDirection: "row",
		alignItems: "center",
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
		marginBottom: 10,
	},
	headerLeft: { width: 60 },
	headerCenter: { flex: 1, alignItems: "center" },
	headerRight: { width: 60, alignItems: "flex-end" },
	headerTitle: { fontSize: 17, fontWeight: "600", color: "#343a40" },
	headerActionText: { fontSize: 24, color: "#007bff", fontWeight: "300" },
	headerActionTextBold: { fontSize: 16, color: "#007bff", fontWeight: "600" },
	homeContent: { flex: 1, justifyContent: "center" },
	footer: { paddingTop: 10 },
	label: {
		fontSize: 16,
		color: "#495057",
		marginBottom: 8,
		textAlign: "center",
	},
	formLabel: { fontSize: 16, color: "#495057", marginBottom: 8 },
	input: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#ced4da",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
	},
	textarea: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#ced4da",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		textAlignVertical: "top",
		minHeight: 100,
	},
	button: {
		paddingVertical: 15,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	blueButton: { backgroundColor: "#007bff" },
	grayButton: { backgroundColor: "#e9ecef" },
	buttonTextWhite: { color: "white", fontSize: 16, fontWeight: "bold" },
	buttonTextGray: { color: "#495057", fontSize: 16, fontWeight: "bold" },
	formContainer: { flex: 1 },
	inputGroup: { marginBottom: 20 },
	listContainer: { flex: 1 },
	logItem: {
		backgroundColor: "white",
		padding: 15,
		borderRadius: 8,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	logItemHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
	},
	logDate: { fontSize: 12, color: "#6c757d" },
	logThought: {
		fontSize: 16,
		fontWeight: "500",
		color: "#343a40",
		marginBottom: 8,
	},
	moodContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#f1f3f5",
		paddingTop: 8,
	},
	moodText: { fontSize: 14, color: "#495057", lineHeight: 22 },
	moodArrow: {
		marginHorizontal: 8,
		color: "#6c757d",
		fontSize: 18,
		fontWeight: "bold",
		alignSelf: "center",
	},
	redButton: { backgroundColor: "#dc3545", marginTop: 20 },
	moodsWrapper: { marginBottom: 10 },
	moodInputRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
		backgroundColor: "white",
		paddingVertical: 4,
		paddingHorizontal: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	moodName: { flex: 1, fontSize: 16, color: "#343a40", fontWeight: "500" },
	levelSelector: { flexDirection: "row" },
	levelEmoji: { fontSize: 20, marginHorizontal: 3 },
	removeButton: { marginLeft: 10, padding: 5 },
	removeButtonText: { fontSize: 20, color: "#adb5bd" },
	tagContainer: { flexDirection: "row", flexWrap: "wrap" },
	tag: {
		backgroundColor: "#e9ecef",
		borderRadius: 15,
		paddingVertical: 8,
		paddingHorizontal: 12,
		marginRight: 8,
		marginBottom: 8,
	},
	tagText: { color: "#495057", fontSize: 14 },
	clearButton: { marginTop: 20, padding: 10, alignItems: "center" },
	clearButtonText: {
		fontSize: 12,
		color: "#6c757d",
		textDecorationLine: "underline",
	},
	emptyText: { textAlign: "center", color: "#6c757d", marginTop: 40 },
	tagSelected: { backgroundColor: "#007bff" },
	tagTextSelected: { color: "white" },
	chartContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
	},
	chartWrapper: {
		flexDirection: "row",
		alignItems: "flex-end",
		width: "100%",
		borderBottomWidth: 1,
		borderBottomColor: "#ced4da",
		paddingBottom: 5,
	},
	yAxisContainer: {
		height: MAX_MOOD_LEVEL * BAR_HEIGHT_MULTIPLIER,
		justifyContent: "space-between",
		paddingRight: 5,
		alignItems: "flex-end",
	},
	yAxisLabel: { fontSize: 12, color: "#6c757d" },
	barChart: {
		flexDirection: "row",
		alignItems: "flex-end",
		height: MAX_MOOD_LEVEL * BAR_HEIGHT_MULTIPLIER,
		paddingLeft: 10,
	},
	barGroup: { flex: 1, alignItems: "center", minWidth: 50 },
	barWrapper: {
		width: "80%",
		height: MAX_MOOD_LEVEL * BAR_HEIGHT_MULTIPLIER,
		alignItems: "center",
	},
	bar: { width: "60%", borderRadius: 3, position: "absolute", bottom: 0 },
	barBefore: { backgroundColor: "rgba(220, 53, 69, 0.6)" },
	barAfter: { backgroundColor: "rgba(40, 167, 69, 0.6)" },
	barLabel: { marginTop: 5, fontSize: 12, color: "#6c757d" },
	legendContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
		padding: 10,
		backgroundColor: "#e9ecef",
		borderRadius: 8,
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 10,
	},
	legendColor: { width: 15, height: 15, marginRight: 5, borderRadius: 3 },
	favoriteButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		marginTop: -10,
		marginBottom: 10,
	},
	favoriteIcon: { fontSize: 24, color: "#ced4da" },
	favoriteIconActive: { fontSize: 24, color: "#ffc107" },
	favoriteButtonText: { marginLeft: 5, color: "#6c757d", fontSize: 14 },
	logFavoriteButton: { padding: 5 },
	tabBar: {
		flexDirection: "row",
		backgroundColor: "white",
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
	},
	tabItem: { flex: 1, alignItems: "center", paddingVertical: 15 },
	tabText: { color: "#6c757d" },
	tabTextActive: { color: "#007bff", fontWeight: "bold" },
	kizukiCard: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 8,
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	kizukiText: {
		fontSize: 16,
		color: "#343a40",
		lineHeight: 24,
		marginBottom: 15,
	},
	kizukiDate: { fontSize: 12, color: "#adb5bd", textAlign: "right" },
});
