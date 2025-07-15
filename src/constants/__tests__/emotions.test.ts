import { EMOTION_TAGS, EMOTIONS } from "../emotions";

describe("emotions constants", () => {
	describe("EMOTIONS", () => {
		it("should contain all expected emotions with correct emojis", () => {
			expect(EMOTIONS).toEqual({
				イライラ: "😠",
				不安: "😥",
				ゆううつ: "😞",
				焦り: "😰",
				虚しさ: "🫥",
				無気力: "😮‍💨",
			});
		});

		it("should have 6 emotions defined", () => {
			expect(Object.keys(EMOTIONS)).toHaveLength(6);
		});

		it("should have unique emojis for each emotion", () => {
			const emojis = Object.values(EMOTIONS);
			const uniqueEmojis = [...new Set(emojis)];
			expect(emojis).toHaveLength(uniqueEmojis.length);
		});

		it("should have Japanese emotion names", () => {
			const emotionNames = Object.keys(EMOTIONS);
			emotionNames.forEach((name) => {
				expect(typeof name).toBe("string");
				expect(name.length).toBeGreaterThan(0);
			});
		});

		it("should have valid emoji values", () => {
			const emojis = Object.values(EMOTIONS);
			emojis.forEach((emoji) => {
				expect(typeof emoji).toBe("string");
				expect(emoji.length).toBeGreaterThan(0);
			});
		});
	});

	describe("EMOTION_TAGS", () => {
		it("should contain all emotion names from EMOTIONS object", () => {
			const expectedTags = Object.keys(EMOTIONS);
			expect(EMOTION_TAGS).toEqual(expectedTags);
		});

		it("should have same length as EMOTIONS keys", () => {
			expect(EMOTION_TAGS).toHaveLength(Object.keys(EMOTIONS).length);
		});

		it("should be an array of strings", () => {
			expect(Array.isArray(EMOTION_TAGS)).toBe(true);
			EMOTION_TAGS.forEach((tag) => {
				expect(typeof tag).toBe("string");
			});
		});

		it("should include all expected emotion tags", () => {
			const expectedTags = [
				"イライラ",
				"不安",
				"ゆううつ",
				"焦り",
				"虚しさ",
				"無気力",
			];
			expect(EMOTION_TAGS).toEqual(expect.arrayContaining(expectedTags));
		});
	});

	describe("data integrity", () => {
		it("should maintain consistency between EMOTIONS and EMOTION_TAGS", () => {
			const emotionKeys = Object.keys(EMOTIONS);
			expect(EMOTION_TAGS).toEqual(emotionKeys);
		});

		it("should support lookups for all emotion tags", () => {
			EMOTION_TAGS.forEach((tag) => {
				expect(EMOTIONS[tag]).toBeDefined();
				expect(typeof EMOTIONS[tag]).toBe("string");
			});
		});
	});
});
