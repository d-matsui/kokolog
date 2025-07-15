import { Text, TextInput, View } from "react-native";
import { styles } from "../styles/styles";

interface FormInputProps {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	multiline?: boolean;
}

const FormInput = ({
	label,
	value,
	onChangeText,
	placeholder,
	multiline = false,
}: FormInputProps) => (
	<View style={styles.inputGroup}>
		<Text style={styles.formLabel}>{label}</Text>
		<TextInput
			style={multiline ? styles.textarea : styles.input}
			value={value}
			onChangeText={onChangeText}
			placeholder={placeholder}
			multiline={multiline}
		/>
	</View>
);
export default FormInput;
