import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export function useAsyncStorage<T>(
	key: string,
	initialValue: T,
): {
	data: T;
	isLoading: boolean;
	error: Error | null;
	setData: (value: T | ((prevData: T) => T)) => void;
	removeData: () => Promise<void>;
} {
	const [data, setData] = useState<T>(initialValue);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	// Load data on mount
	useEffect(() => {
		const loadData = async () => {
			try {
				const jsonValue = await AsyncStorage.getItem(key);
				if (jsonValue !== null) {
					setData(JSON.parse(jsonValue));
				}
			} catch (e) {
				setError(e as Error);
			} finally {
				setIsLoading(false);
			}
		};
		loadData();
	}, [key]);

	// Save data when it changes
	useEffect(() => {
		if (!isLoading) {
			const saveData = async () => {
				try {
					await AsyncStorage.setItem(key, JSON.stringify(data));
				} catch (e) {
					setError(e as Error);
					console.error(`Failed to save data for key: ${key}`, e);
				}
			};
			saveData();
		}
	}, [data, isLoading, key]);

	const removeData = useCallback(async () => {
		try {
			await AsyncStorage.removeItem(key);
			setData(initialValue);
		} catch (e) {
			setError(e as Error);
			throw e;
		}
	}, [key, initialValue]);

	const updateData = useCallback((value: T | ((prevData: T) => T)) => {
		setData(value);
	}, []);

	return { data, isLoading, error, setData: updateData, removeData };
}
