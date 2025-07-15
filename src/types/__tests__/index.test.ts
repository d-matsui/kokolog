import type { Log, LogContextType, Mood } from "../index";

describe("Type definitions", () => {
	describe("Mood interface", () => {
		it("should have correct structure", () => {
			const mood: Mood = {
				name: "イライラ",
				level: 3,
			};

			expect(mood.name).toBe("イライラ");
			expect(mood.level).toBe(3);
			expect(typeof mood.name).toBe("string");
			expect(typeof mood.level).toBe("number");
		});

		it("should accept valid mood levels", () => {
			const validLevels = [1, 2, 3, 4, 5];
			validLevels.forEach((level) => {
				const mood: Mood = {
					name: "テスト",
					level: level,
				};
				expect(mood.level).toBe(level);
			});
		});
	});

	describe("Log interface", () => {
		it("should have correct structure", () => {
			const log: Log = {
				id: "1",
				date: "2024-01-01T10:00:00.000Z",
				autoThought: "Test thought",
				situation: "Test situation",
				beforeMoods: [{ name: "イライラ", level: 3 }],
				afterMoods: [{ name: "イライラ", level: 1 }],
				evidence: "Test evidence",
				counterEvidence: "Test counter evidence",
				newThought: "Test new thought",
				isFavorite: false,
			};

			expect(log.id).toBe("1");
			expect(log.date).toBe("2024-01-01T10:00:00.000Z");
			expect(log.autoThought).toBe("Test thought");
			expect(log.situation).toBe("Test situation");
			expect(Array.isArray(log.beforeMoods)).toBe(true);
			expect(Array.isArray(log.afterMoods)).toBe(true);
			expect(log.evidence).toBe("Test evidence");
			expect(log.counterEvidence).toBe("Test counter evidence");
			expect(log.newThought).toBe("Test new thought");
			expect(log.isFavorite).toBe(false);
		});

		it("should accept empty mood arrays", () => {
			const log: Log = {
				id: "1",
				date: "2024-01-01T10:00:00.000Z",
				autoThought: "Test thought",
				situation: "Test situation",
				beforeMoods: [],
				afterMoods: [],
				evidence: "",
				counterEvidence: "",
				newThought: "",
				isFavorite: false,
			};

			expect(log.beforeMoods).toEqual([]);
			expect(log.afterMoods).toEqual([]);
		});

		it("should accept multiple moods", () => {
			const log: Log = {
				id: "1",
				date: "2024-01-01T10:00:00.000Z",
				autoThought: "Test thought",
				situation: "Test situation",
				beforeMoods: [
					{ name: "イライラ", level: 3 },
					{ name: "不安", level: 2 },
				],
				afterMoods: [
					{ name: "イライラ", level: 1 },
					{ name: "不安", level: 1 },
				],
				evidence: "",
				counterEvidence: "",
				newThought: "",
				isFavorite: true,
			};

			expect(log.beforeMoods).toHaveLength(2);
			expect(log.afterMoods).toHaveLength(2);
			expect(log.isFavorite).toBe(true);
		});

		it("should accept ISO 8601 date format", () => {
			const log: Log = {
				id: "1",
				date: "2024-01-01T10:00:00.000Z",
				autoThought: "Test thought",
				situation: "Test situation",
				beforeMoods: [],
				afterMoods: [],
				evidence: "",
				counterEvidence: "",
				newThought: "",
				isFavorite: false,
			};

			expect(log.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
		});
	});

	describe("LogContextType interface", () => {
		it("should define correct function signatures", () => {
			// This is a compile-time test to ensure the interface is properly defined
			// The actual implementation would be tested in LogContext.test.tsx
			const mockContext: LogContextType = {
				logs: [],
				isLoading: false,
				addLog: jest.fn(),
				updateLog: jest.fn(),
				deleteLog: jest.fn(),
				toggleFavorite: jest.fn(),
				clearAllLogs: jest.fn(),
			};

			expect(Array.isArray(mockContext.logs)).toBe(true);
			expect(typeof mockContext.isLoading).toBe("boolean");
			expect(typeof mockContext.addLog).toBe("function");
			expect(typeof mockContext.updateLog).toBe("function");
			expect(typeof mockContext.deleteLog).toBe("function");
			expect(typeof mockContext.toggleFavorite).toBe("function");
			expect(typeof mockContext.clearAllLogs).toBe("function");
		});
	});

	describe("Type compatibility", () => {
		it("should work with Omit utility type for new logs", () => {
			const newLogData: Omit<Log, "id" | "date"> = {
				autoThought: "Test thought",
				situation: "Test situation",
				beforeMoods: [],
				afterMoods: [],
				evidence: "",
				counterEvidence: "",
				newThought: "",
				isFavorite: false,
			};

			expect(newLogData.autoThought).toBe("Test thought");
			expect(newLogData.situation).toBe("Test situation");
			expect("id" in newLogData).toBe(false);
			expect("date" in newLogData).toBe(false);
		});

		it("should work with Partial utility type for editing", () => {
			const partialLog: Partial<Log> = {
				id: "1",
				autoThought: "Partial thought",
			};

			expect(partialLog.id).toBe("1");
			expect(partialLog.autoThought).toBe("Partial thought");
			expect(partialLog.situation).toBeUndefined();
		});
	});
});
