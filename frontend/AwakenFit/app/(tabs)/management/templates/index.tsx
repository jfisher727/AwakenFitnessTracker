import { Text, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import CustomButton from "@/components/general/button";

export default function Templates() {
    const colorScheme = useColorScheme();

    function createPressed() {
        router.navigate("/(tabs)/management/templates/create");
    }

    function listPressed() {
        router.navigate("/(tabs)/management/templates/list");
    }

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
                    Manage Your Template Workouts
                </Text>
                <CustomButton
                    text="Create Template"
                    onPress={createPressed}
                    disabled={false}
                />
                <CustomButton
                    text="Template List"
                    onPress={listPressed}
                    disabled={false}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
