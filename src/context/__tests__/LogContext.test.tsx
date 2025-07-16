import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook } from "@testing-library/react-native";
import { Alert } from "react-native";
import type { Log } from "../../types";
import { LogProvider, useLogs } from "../LogContext";

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockAlert = Alert as jest.Mocked<typeof Alert>;

describe("LogContext", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockLog: Log = {
		id: "1",
		date: "2024-01-01T10:00:00.000Z",
		situation: "Test situation",
		autoThought: "Test thought",
		beforeMoods: [{ name: "イライラ", level: 3 }],
		afterMoods: [{ name: "イライラ", level: 1 }],
		evidence: "Test evidence",
		counterEvidence: "Test counter evidence",
		newThought: "Test new thought",
		isFavorite: false,
	};

	const renderLogContext = () => {
		return renderHook(() => useLogs(), {
			wrapper: ({ children }) => <LogProvider>{children}</LogProvider>,
		});
	};

	describe("initialization", () => {
		it("should load logs from AsyncStorage on mount", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockLog]));

			const { result } = renderLogContext();

			expect(result.current.isLoading).toBe(true);

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			expect(result.current.isLoading).toBe(false);
			expect(result.current.logs).toEqual([mockLog]);
			expect(mockAsyncStorage.getItem).toHaveBeenCalledWith("@kokoro_logs");
		});

		it("should handle empty storage gracefully", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(null);

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			expect(result.current.isLoading).toBe(false);
			expect(result.current.logs).toEqual([]);
		});

		it("should handle AsyncStorage errors", async () => {
			mockAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			expect(result.current.isLoading).toBe(false);
			expect(result.current.logs).toEqual([]);
		});
	});

	describe("addLog", () => {
		it("should add a new log with generated id and date", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(null);
			mockAsyncStorage.setItem.mockResolvedValue();

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			const newLogData = {
				situation: "New situation",
				autoThought: "New thought",
				beforeMoods: [],
				afterMoods: [],
				evidence: "",
				counterEvidence: "",
				newThought: "",
				isFavorite: false,
			};

			await act(async () => {
				result.current.addLog(newLogData);
			});

			expect(result.current.logs).toHaveLength(1);
			expect(result.current.logs[0]).toMatchObject(newLogData);
			expect(result.current.logs[0].id).toBeDefined();
			expect(result.current.logs[0].date).toBeDefined();
		});

		it("should prepend new log to existing logs", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockLog]));
			mockAsyncStorage.setItem.mockResolvedValue();

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			const newLogData = {
				situation: "New situation",
				autoThought: "New thought",
				beforeMoods: [],
				afterMoods: [],
				evidence: "",
				counterEvidence: "",
				newThought: "",
				isFavorite: false,
			};

			await act(async () => {
				result.current.addLog(newLogData);
			});

			expect(result.current.logs).toHaveLength(2);
			expect(result.current.logs[0]).toMatchObject(newLogData);
			expect(result.current.logs[1]).toEqual(mockLog);
		});
	});

	describe("updateLog", () => {
		it("should update existing log", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockLog]));
			mockAsyncStorage.setItem.mockResolvedValue();

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			const updatedLog = {
				...mockLog,
				situation: "Updated situation",
				isFavorite: true,
			};

			await act(async () => {
				result.current.updateLog(updatedLog);
			});

			expect(result.current.logs).toHaveLength(1);
			expect(result.current.logs[0]).toMatchObject({
				...updatedLog,
				date: expect.any(String),
			});
			expect(result.current.logs[0].date).not.toBe(mockLog.date);
		});
	});

	describe("deleteLog", () => {
		it("should remove log by id", async () => {
			const log2 = { ...mockLog, id: "2" };
			mockAsyncStorage.getItem.mockResolvedValue(
				JSON.stringify([mockLog, log2]),
			);
			mockAsyncStorage.setItem.mockResolvedValue();

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await act(async () => {
				result.current.deleteLog("1");
			});

			expect(result.current.logs).toHaveLength(1);
			expect(result.current.logs[0]).toEqual(log2);
		});
	});

	describe("toggleFavorite", () => {
		it("should toggle favorite status", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockLog]));
			mockAsyncStorage.setItem.mockResolvedValue();

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await act(async () => {
				result.current.toggleFavorite("1");
			});

			expect(result.current.logs[0].isFavorite).toBe(true);

			await act(async () => {
				result.current.toggleFavorite("1");
			});

			expect(result.current.logs[0].isFavorite).toBe(false);
		});
	});

	describe("clearAllLogs", () => {
		it("should clear all logs successfully", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockLog]));
			mockAsyncStorage.removeItem.mockResolvedValue();

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await act(async () => {
				result.current.clearAllLogs();
			});

			expect(result.current.logs).toEqual([]);
			expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith("@kokoro_logs");
			expect(mockAlert.alert).toHaveBeenCalledWith(
				"完了",
				"すべてのデータを削除しました。",
			);
		});

		it("should handle clear error", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockLog]));
			mockAsyncStorage.removeItem.mockRejectedValue(new Error("Remove error"));

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await act(async () => {
				result.current.clearAllLogs();
			});

			expect(mockAlert.alert).toHaveBeenCalledWith(
				"エラー",
				"データの削除に失敗しました。",
			);
		});
	});

	describe("insertTestData", () => {
		it("should insert 5 test logs successfully", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
			mockAsyncStorage.setItem.mockResolvedValue();

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await act(async () => {
				result.current.insertTestData();
			});

			expect(result.current.logs).toHaveLength(5);
			expect(mockAlert.alert).toHaveBeenCalledWith(
				"完了",
				"5件のテストデータを挿入しました。",
			);

			// Verify that all test logs have required properties
			result.current.logs.forEach((log) => {
				expect(log).toMatchObject({
					id: expect.any(String),
					date: expect.any(String),
					situation: expect.any(String),
					autoThought: expect.any(String),
					beforeMoods: expect.any(Array),
					afterMoods: expect.any(Array),
					evidence: expect.any(String),
					counterEvidence: expect.any(String),
					newThought: expect.any(String),
					isFavorite: expect.any(Boolean),
				});
			});
		});

		it("should prepend test data to existing logs", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockLog]));
			mockAsyncStorage.setItem.mockResolvedValue();

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await act(async () => {
				result.current.insertTestData();
			});

			expect(result.current.logs).toHaveLength(6); // 5 test logs + 1 existing
			// The original log should be at the end since new logs are prepended
			expect(result.current.logs[5]).toEqual(mockLog);
		});

		it("should handle insert error gracefully", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
			// Mock addLog to throw an error by mocking setItem to fail
			mockAsyncStorage.setItem.mockRejectedValue(new Error("Storage error"));

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			await act(async () => {
				result.current.insertTestData();
			});

			expect(mockAlert.alert).toHaveBeenCalledWith(
				"エラー",
				"テストデータの挿入に失敗しました。",
			);
		});
	});

	describe("persistence", () => {
		it("should save logs to AsyncStorage when logs change", async () => {
			mockAsyncStorage.getItem.mockResolvedValue(null);
			mockAsyncStorage.setItem.mockResolvedValue();

			const { result } = renderLogContext();

			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			const newLogData = {
				situation: "New situation",
				autoThought: "New thought",
				beforeMoods: [],
				afterMoods: [],
				evidence: "",
				counterEvidence: "",
				newThought: "",
				isFavorite: false,
			};

			await act(async () => {
				result.current.addLog(newLogData);
			});

			expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
				"@kokoro_logs",
				expect.any(String),
			);
		});
	});
});
