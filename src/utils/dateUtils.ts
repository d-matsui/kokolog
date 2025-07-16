/**
 * Formats a log date string for display in the list view
 * @param dateString - ISO date string
 * @returns Formatted date string (time for today, "昨日" for yesterday, "X日前" for recent days, or date for older entries)
 */
export function formatLogDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		// Today - show time
		return date.toLocaleTimeString("ja-JP", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	if (diffDays === 1) {
		return "昨日";
	}

	if (diffDays < 7) {
		return `${diffDays}日前`;
	}

	// More than a week - show date
	return date.toLocaleDateString("ja-JP", {
		month: "numeric",
		day: "numeric",
	});
}

/**
 * Formats a date string for full display with day of week and time
 * @param dateString - ISO date string
 * @returns Full formatted date string with year, month, day, weekday, and time
 */
export function formatFullDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
		weekday: "long",
		hour: "2-digit",
		minute: "2-digit",
	});
}
