import { useEffect, useMemo, useState } from "react";
import {
	Dimensions,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import ScreenWrapper from "../components/ScreenWrapper";
import { EMOTIONS } from "../constants/emotions";
import { useLogs } from "../context/LogContext";
import { styles } from "../styles/styles";
import type { Log } from "../types";

const screenWidth = Dimensions.get("window").width;

// グラフのデザイン設定
const chartConfig = {
	backgroundGradientFrom: "#ffffff",
	backgroundGradientTo: "#ffffff",
	decimalPlaces: 0,
	color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
	labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
	style: {
		borderRadius: 16,
	},
	propsForDots: {
		r: "4",
		strokeWidth: "2",
	},
};

interface GraphScreenProps {
	onSelectLog: (log: Log) => void;
}

const GraphScreen = ({ onSelectLog }: GraphScreenProps) => {
	const { logs } = useLogs();
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
	const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedEmotion && availableEmotions.length > 0) {
			setSelectedEmotion(availableEmotions[0]);
		}
	}, [availableEmotions, selectedEmotion]);

	const filteredLogs = useMemo(() => {
		if (!selectedEmotion) return [];
		return logs
			.filter(
				(log) =>
					log.beforeMoods?.some((m) => m.name === selectedEmotion) ||
					log.afterMoods?.some((m) => m.name === selectedEmotion),
			)
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.slice(-7);
	}, [logs, selectedEmotion]);

	const chartData = useMemo(() => {
		if (filteredLogs.length < 2) {
			return null;
		}

		const labels = filteredLogs.map((log) => {
			const d = new Date(log.date);
			return `${d.getMonth() + 1}/${d.getDate()}`;
		});

		const beforeData = filteredLogs.map((log) => {
			const mood = log.beforeMoods.find((m) => m.name === selectedEmotion);
			return mood ? mood.level : 0;
		});

		const afterData = filteredLogs.map((log) => {
			const mood = log.afterMoods.find((m) => m.name === selectedEmotion);
			return mood ? mood.level : 0;
		});

		return {
			labels,
			datasets: [
				{
					data: beforeData,
					color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`, // 赤色
					strokeWidth: 2,
				},
				{
					data: afterData,
					color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`, // 緑色
					strokeWidth: 2,
				},
			],
			legend: ["記入前", "記入後"],
		};
	}, [filteredLogs, selectedEmotion]);

	const handleDataPointClick = ({ index }: { index: number }) => {
		const selectedLog = filteredLogs[index];
		if (selectedLog) {
			onSelectLog(selectedLog);
		}
	};

	return (
		<ScreenWrapper noPadding>
			<View style={styles.screen}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>気分グラフ</Text>
				</View>
				<ScrollView>
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
						{chartData ? (
							<LineChart
								data={chartData}
								width={screenWidth - 20}
								height={250}
								chartConfig={chartConfig}
								bezier
								style={styles.chart}
								fromZero
								yLabelsOffset={5}
								segments={5}
								onDataPointClick={handleDataPointClick}
							/>
						) : (
							<Text style={styles.emptyText}>
								表示するデータが足りません (2件以上の記録が必要です)。
							</Text>
						)}
					</View>
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};

export default GraphScreen;
