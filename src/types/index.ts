export interface Mood {
	name: string;
	level: number;
}

export interface Log {
	id: string;
	date: string; // ISO 8601形式の文字列
	autoThought: string;
	situation: string;
	beforeMoods: Mood[];
	afterMoods: Mood[];
	evidence: string;
	counterEvidence: string;
	newThought: string;
	isFavorite: boolean;
}

export interface LogContextType {
	logs: Log[];
	isLoading: boolean;
	addLog: (log: Omit<Log, "id" | "date">) => void;
	updateLog: (log: Log) => void;
	deleteLog: (logId: string) => void;
	toggleFavorite: (logId: string) => void;
	clearAllLogs: () => Promise<void>;
	insertTestData: () => Promise<void>;
}
