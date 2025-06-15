import { Text, View, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import { baseStyles, lightColors, darkColors } from "@/styles/global";
import CustomButton from "@/components/general/button";

export default function Profile() {
    const colorScheme = useColorScheme();

    function createPressed() {
        router.navigate("/(tabs)/profile/movement/create");
    }

    function editPressed() {
        router.navigate("/(tabs)/profile/movement/edit");
    }

    return (
        <SafeAreaProvider>
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
                        ...baseStyles.header,
                        color:
                            colorScheme === "light"
                                ? lightColors.primaryColor
                                : darkColors.primaryColor,
                    }}
                >
                    Manage Stored Movements
                </Text>
                <View
                    style={{
                        ...baseStyles.modal,
                    }}
                >
                    <CustomButton
                        text="Create Movement"
                        onPress={createPressed}
                        disabled={false}
                    />
                    <CustomButton
                        text="Edit Movement"
                        onPress={editPressed}
                        disabled={false}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
