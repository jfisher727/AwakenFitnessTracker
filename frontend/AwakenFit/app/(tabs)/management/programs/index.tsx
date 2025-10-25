import { View, Text, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import CustomButton from "@/components/general/button";

export default function Programs() {
    const colorScheme = useColorScheme();

    function createPressed() {
        router.navigate("/(tabs)/management/programs/create");
    }

    function startPressed() {
        router.navigate("/(tabs)/management/programs/start");
    }

    function listPressed() {
        router.navigate("/(tabs)/management/programs/list");
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
                <View style={baseStyles.modal}>
                    <Text
                        style={{
                            ...baseStyles.subHeader,
                            color:
                                colorScheme === "light"
                                    ? lightColors.primaryColor
                                    : darkColors.primaryColor,
                        }}
                    >
                        Manage Your Workouts Programs
                    </Text>
                    <CustomButton
                        text="Create Program"
                        onPress={createPressed}
                        disabled={false}
                    />
                    <CustomButton
                        text="Start a Program"
                        onPress={startPressed}
                        disabled={false}
                    />
                    <CustomButton
                        text="Your Programs"
                        onPress={listPressed}
                        disabled={false}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
