import React, { type ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
	children: ReactNode;
	noPadding?: boolean;
}

const ScreenWrapper = ({ children, noPadding = false }: ScreenWrapperProps) => {
	const insets = useSafeAreaInsets();
	return (
		<View
			style={{
				flex: 1,
				paddingTop: insets.top,
				paddingBottom: noPadding ? 0 : insets.bottom,
				paddingLeft: insets.left,
				paddingRight: insets.right,
			}}
		>
			{children}
		</View>
	);
};
export default ScreenWrapper;
