import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";
import type { Log } from "../../types";
import FormScreen from "../FormScreen";

const mockAlert = Alert as jest.Mocked<typeof Alert>;

describe("FormScreen", () => {
	const mockOnGoBack = jest.fn();
	const mockOnSave = jest.fn();
	const mockOnDelete = jest.fn();

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

	describe("rendering", () => {
		it("should render form with empty fields for new log", () => {
			render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={null}
				/>,
			);

			expect(screen.getByText("コラム作成")).toBeTruthy();
			expect(screen.getByText("保存")).toBeTruthy();
			expect(
				screen.getByPlaceholderText("例：朝の会議で発言できなかった"),
			).toBeTruthy();
			expect(
				screen.getByPlaceholderText("例：「どうせ自分は評価されていないんだ」"),
			).toBeTruthy();
		});

		it("should render form with populated fields for editing", () => {
			render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={mockLog}
				/>,
			);

			expect(screen.getByText("記録の編集")).toBeTruthy();
			expect(screen.getByText("更新")).toBeTruthy();
			expect(screen.getByDisplayValue("Test situation")).toBeTruthy();
			expect(screen.getByDisplayValue("Test thought")).toBeTruthy();
			expect(screen.getByDisplayValue("Test evidence")).toBeTruthy();
			expect(screen.getByDisplayValue("Test counter evidence")).toBeTruthy();
			expect(screen.getByDisplayValue("Test new thought")).toBeTruthy();
		});

		it("should show delete button only when editing", () => {
			const { rerender } = render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={null}
				/>,
			);

			expect(screen.queryByText("この記録を削除する")).toBeFalsy();

			rerender(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={mockLog}
				/>,
			);

			expect(screen.getByText("この記録を削除する")).toBeTruthy();
		});
	});

	describe("interactions", () => {
		it("should call onGoBack when back button is pressed", () => {
			render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={null}
				/>,
			);

			fireEvent.press(screen.getByText("〈"));
			expect(mockOnGoBack).toHaveBeenCalled();
		});

		it("should call onSave with new log data when save button is pressed", () => {
			render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={null}
				/>,
			);

			const situationInput = screen.getByPlaceholderText(
				"例：朝の会議で発言できなかった",
			);
			const thoughtInput = screen.getByPlaceholderText(
				"例：「どうせ自分は評価されていないんだ」",
			);

			fireEvent.changeText(situationInput, "New situation");
			fireEvent.changeText(thoughtInput, "New thought");

			fireEvent.press(screen.getByText("保存"));

			expect(mockOnSave).toHaveBeenCalledWith({
				situation: "New situation",
				beforeMoods: [],
				autoThought: "New thought",
				evidence: "",
				counterEvidence: "",
				newThought: "",
				afterMoods: [],
				isFavorite: false,
			});
		});

		it("should call onSave with updated log data when editing", () => {
			render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={mockLog}
				/>,
			);

			const situationInput = screen.getByDisplayValue("Test situation");
			fireEvent.changeText(situationInput, "Updated situation");

			fireEvent.press(screen.getByText("更新"));

			expect(mockOnSave).toHaveBeenCalledWith({
				...mockLog,
				situation: "Updated situation",
			});
		});

		it("should toggle favorite status", () => {
			render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={null}
				/>,
			);

			const favoriteButton = screen.getByText("大切な気づき");
			fireEvent.press(favoriteButton);

			fireEvent.press(screen.getByText("保存"));

			expect(mockOnSave).toHaveBeenCalledWith(
				expect.objectContaining({
					isFavorite: true,
				}),
			);
		});

		it("should show confirmation dialog when delete is pressed", () => {
			render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={mockLog}
				/>,
			);

			fireEvent.press(screen.getByText("この記録を削除する"));

			expect(mockAlert.alert).toHaveBeenCalledWith(
				"記録の削除",
				"この記録を本当に削除しますか？",
				expect.arrayContaining([
					expect.objectContaining({ text: "キャンセル" }),
					expect.objectContaining({ text: "削除する" }),
				]),
			);
		});

		it("should call onDelete when delete is confirmed", () => {
			render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={mockLog}
				/>,
			);

			fireEvent.press(screen.getByText("この記録を削除する"));

			// Get the delete confirmation function from the Alert.alert call
			const alertCall = mockAlert.alert.mock.calls[0];
			const deleteConfirmButton = alertCall[2]?.find(
				(button) => button.text === "削除する",
			);
			if (deleteConfirmButton?.onPress) {
				deleteConfirmButton.onPress();
			}

			expect(mockOnDelete).toHaveBeenCalledWith("1");
		});
	});

	describe("form validation", () => {
		it("should handle empty form submission", () => {
			render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={null}
				/>,
			);

			fireEvent.press(screen.getByText("保存"));

			expect(mockOnSave).toHaveBeenCalledWith({
				situation: "",
				beforeMoods: [],
				autoThought: "",
				evidence: "",
				counterEvidence: "",
				newThought: "",
				afterMoods: [],
				isFavorite: false,
			});
		});
	});

	describe("initialization from quick memo", () => {
		it("should initialize autoThought from quick memo", () => {
			const quickMemoLog = { autoThought: "Quick memo text" };

			render(
				<FormScreen
					onGoBack={mockOnGoBack}
					onSave={mockOnSave}
					onDelete={mockOnDelete}
					initialLog={quickMemoLog}
				/>,
			);

			expect(screen.getByDisplayValue("Quick memo text")).toBeTruthy();
		});
	});
});
