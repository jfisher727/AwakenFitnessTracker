import { Text, View, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useSession } from "@/auth/AuthContext";
import { useGetIsSuperuserQuery } from "@/graphql/types";

import { baseStyles, lightColors, darkColors } from "@/styles/global";
import CustomButton from "@/components/general/button";

export default function Profile() {
    const colorScheme = useColorScheme();
    const { signOut } = useSession();

    const { data, loading, error } = useGetIsSuperuserQuery();

    function logoutPressed() {
        signOut();
    }

    function verifyEmailPressed() {
        router.navigate("/account/verify_email");
    }

    function movementPressed() {
        router.navigate("/(tabs)/profile/movement");
    }

    if (error) {
        console.log(error);
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
                    Welcome, to your profile
                </Text>
                <View
                    style={{
                        ...baseStyles.modal,
                    }}
                >
                    <CustomButton
                        text="Verify Email"
                        onPress={verifyEmailPressed}
                        disabled={false}
                    />
                    {(data?.isSuperUser ?? false) && (
                        <CustomButton
                            text="Movement Management"
                            onPress={movementPressed}
                            disabled={false}
                        />
                    )}
                    <CustomButton
                        text="Logout"
                        onPress={logoutPressed}
                        disabled={false}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
