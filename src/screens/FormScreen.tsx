import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FormInput from "../components/FormInput";
import MoodInput from "../components/MoodInput";
import ScreenWrapper from "../components/ScreenWrapper";
import { styles } from "../styles/styles";
import type { Log, Mood } from "../types";

interface FormScreenProps {
	onGoBack: () => void;
	onSave: (log: Log | Omit<Log, "id" | "date">) => void;
	onDelete: (logId: string) => void;
	initialLog: Partial<Log> | null;
}

const FormScreen = ({
	onGoBack,
	onSave,
	onDelete,
	initialLog,
}: FormScreenProps) => {
	const [situation, setSituation] = useState(initialLog?.situation || "");
	const [beforeMoods, setBeforeMoods] = useState<Mood[]>(
		initialLog?.beforeMoods || [],
	);
	const [autoThought, setAutoThought] = useState(initialLog?.autoThought || "");
	const [evidence, setEvidence] = useState(initialLog?.evidence || "");
	const [counterEvidence, setCounterEvidence] = useState(
		initialLog?.counterEvidence || "",
	);
	const [newThought, setNewThought] = useState(initialLog?.newThought || "");
	const [afterMoods, setAfterMoods] = useState<Mood[]>(
		initialLog?.afterMoods || [],
	);
	const [isFavorite, setIsFavorite] = useState(initialLog?.isFavorite || false);

	const isEditing = !!initialLog?.id;

	const handleSave = () => {
		if (isEditing) {
			onSave({
				...initialLog,
				id: initialLog?.id || "",
				date: initialLog?.date || "",
				situation,
				beforeMoods,
				autoThought,
				evidence,
				counterEvidence,
				newThought,
				afterMoods,
				isFavorite,
			} as Log);
		} else {
			onSave({
				situation,
				beforeMoods,
				autoThought,
				evidence,
				counterEvidence,
				newThought,
				afterMoods,
				isFavorite,
			});
		}
	};

	const confirmDelete = () => {
		if (initialLog?.id) {
			Alert.alert("記録の削除", "この記録を本当に削除しますか？", [
				{ text: "キャンセル", style: "cancel" },
				{
					text: "削除する",
					onPress: () => {
						if (initialLog?.id) {
							onDelete(initialLog.id);
						}
					},
					style: "destructive",
				},
			]);
		}
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
export default FormScreen;
