import { Text, View, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useSession } from "@/auth/AuthContext";
import { baseStyles, lightColors, darkColors } from "@/styles/global";
import CustomButton from "@/components/general/button";

export default function Edit() {
    const colorScheme = useColorScheme();

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
                <Text>Edit Movement Page</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
