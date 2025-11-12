import { Stack } from "expo-router";

export default function AccountLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="register" />
            <Stack.Screen name="sign_in" />
        </Stack>
    );
}
