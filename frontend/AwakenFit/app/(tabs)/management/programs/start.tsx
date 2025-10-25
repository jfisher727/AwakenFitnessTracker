import { Text, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import CustomButton from "@/components/general/button";

export default function StartProgram() {
    const colorScheme = useColorScheme();

    return (
        <SafeAreaProvider style={baseStyles.parent}>
            <SafeAreaView
                style={{
                    ...baseStyles.container,
                    backgroundColor:
                        colorScheme === "light"
                            ? lightColors.background
                            : darkColors.background,
                }}
            >
                <Text
                    style={{
                        ...baseStyles.subHeader,
                        color:
                            colorScheme === "light"
                                ? lightColors.primaryColor
                                : darkColors.primaryColor,
                    }}
                >
                    Start a Workout Program
                </Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
