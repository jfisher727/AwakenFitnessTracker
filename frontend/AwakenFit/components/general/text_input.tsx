import { useState, useEffect } from "react";
import { TextInput, Text, View, useColorScheme } from "react-native";

import { baseStyles, darkColors, lightColors } from "@/styles/global";

const DEBOUNCE_DELAY: number = 250; // milliseconds

type params = {
    inputMode: any;
    onChangeText: any;
    defaultValue: string;
    secureTextEntry: boolean;
    header: string;
    showHeader: boolean;
};
export default function TextInputField({
    inputMode,
    onChangeText,
    defaultValue,
    secureTextEntry,
    header,
    showHeader,
}: params) {
    const colorScheme = useColorScheme();

    const [text, setText] = useState(defaultValue);

    const primaryColor =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onChangeText(text);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timeoutId);
    }, [text]);

    return (
        <View
            style={{
                ...baseStyles.shadowBox,
            }}
        >
            {showHeader && (
                <Text style={{ fontSize: 24, color: primaryColor }}>
                    {header}
                </Text>
            )}
            <TextInput
                onChangeText={(newText) => setText(newText)}
                defaultValue={text}
                inputMode={inputMode}
                secureTextEntry={secureTextEntry}
                style={{ fontSize: 20, color: primaryColor }}
            />
        </View>
    );
}
