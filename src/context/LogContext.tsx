import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { Alert } from "react-native";
import type { Log, LogContextType } from "../types";

export const LogContext = createContext<LogContextType | undefined>(undefined);

export const useLogs = () => {
	const context = useContext(LogContext);
	if (context === undefined) {
		throw new Error("useLogs must be used within a LogProvider");
	}
	return context;
};

export const LogProvider = ({ children }: { children: ReactNode }) => {
	const [logs, setLogs] = useState<Log[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadLogs = async () => {
			try {
				const jsonValue = await AsyncStorage.getItem("@kokoro_logs");
				if (jsonValue !== null) {
					setLogs(JSON.parse(jsonValue));
				}
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

	const addLog = (log: Omit<Log, "id" | "date">) => {
		const newLog: Log = {
			...log,
			id: Date.now().toString(),
			date: new Date().toISOString(),
		};
		setLogs([newLog, ...logs]);
	};

	const updateLog = (logToUpdate: Log) => {
		const updatedLog = { ...logToUpdate, date: new Date().toISOString() };
		setLogs(logs.map((log) => (log.id === updatedLog.id ? updatedLog : log)));
	};

	const deleteLog = (logId: string) => {
		setLogs(logs.filter((log) => log.id !== logId));
	};

	const toggleFavorite = (logId: string) => {
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

	const value: LogContextType = {
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
