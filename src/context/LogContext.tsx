import { createContext, type ReactNode, useCallback, useContext } from "react";
import { Alert } from "react-native";
import { TEST_LOGS_DATA } from "../constants/testData";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import type { Log, LogContextType } from "../types";

export const LogContext = createContext<LogContextType | undefined>(undefined);

export const useLogs = () => {
	const context = useContext(LogContext);
	if (context === undefined) {
		throw new Error("useLogs must be used within a LogProvider");
	}
	return context;
};

const STORAGE_KEY = "@kokoro_logs";

export const LogProvider = ({ children }: { children: ReactNode }) => {
	const {
		data: logs,
		isLoading,
		setData: setLogs,
		removeData,
	} = useAsyncStorage<Log[]>(STORAGE_KEY, []);

	const addLog = useCallback(
		(log: Omit<Log, "id" | "date">) => {
			const newLog: Log = {
				...log,
				id: Date.now().toString(),
				date: new Date().toISOString(),
			};
			setLogs((prevLogs) => [newLog, ...prevLogs]);
		},
		[setLogs],
	);

	const updateLog = useCallback(
		(logToUpdate: Log) => {
			const updatedLog = { ...logToUpdate, date: new Date().toISOString() };
			setLogs((prevLogs) =>
				prevLogs.map((log) => (log.id === updatedLog.id ? updatedLog : log)),
			);
		},
		[setLogs],
	);

	const deleteLog = useCallback(
		(logId: string) => {
			setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
		},
		[setLogs],
	);

	const toggleFavorite = useCallback(
		(logId: string) => {
			setLogs((prevLogs) =>
				prevLogs.map((log) =>
					log.id === logId ? { ...log, isFavorite: !log.isFavorite } : log,
				),
			);
		},
		[setLogs],
	);

	const clearAllLogs = useCallback(async () => {
		try {
			await removeData();
			Alert.alert("完了", "すべてのデータを削除しました。");
		} catch (_e) {
			Alert.alert("エラー", "データの削除に失敗しました。");
		}
	}, [removeData]);

	const insertTestData = useCallback(async () => {
		try {
			// Add logs with proper ID generation
			const newLogs: Log[] = TEST_LOGS_DATA.map((testLog, index) => ({
				...testLog,
				id: (Date.now() + index).toString(),
				date: new Date().toISOString(),
			}));

			// Update state with all new logs prepended to existing logs
			setLogs((prevLogs) => [...newLogs, ...prevLogs]);

			Alert.alert(
				"完了",
				`${TEST_LOGS_DATA.length}件のテストデータを挿入しました。`,
			);
		} catch (_e) {
			Alert.alert("エラー", "テストデータの挿入に失敗しました。");
		}
	}, [setLogs]);

	const value: LogContextType = {
		logs,
		isLoading,
		addLog,
		updateLog,
		deleteLog,
		toggleFavorite,
		clearAllLogs,
		insertTestData,
	};

	return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
};
