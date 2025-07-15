import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { EMOTIONS } from "../constants/emotions";
import { useLogs } from "../context/LogContext";
import {
	BAR_HEIGHT_MULTIPLIER,
	MAX_MOOD_LEVEL,
	styles,
} from "../styles/styles";
import type { Log } from "../types";

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

	const filteredLogs = selectedEmotion
		? logs
				.filter(
					(log) =>
						log.beforeMoods?.some((m) => m.name === selectedEmotion) ||
						log.afterMoods?.some((m) => m.name === selectedEmotion),
				)
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
					{filteredLogs.length > 0 ? (
						<View style={styles.chartWrapper}>
							<View style={styles.yAxisContainer}>
								{[...Array(MAX_MOOD_LEVEL)].map((_, i) => {
									const moodLevel = MAX_MOOD_LEVEL - i;
									return (
										<Text key={moodLevel} style={styles.yAxisLabel}>
											{moodLevel}
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
									const beforeLevel = beforeMood ? beforeMood.level : 0;
									const afterLevel = afterMood ? afterMood.level : 0;
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
					) : (
						<Text style={styles.emptyText}>表示するデータがありません。</Text>
					)}
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
export default GraphScreen;
