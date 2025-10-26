import { Stack } from "expo-router";

export default function AccountLayout() {
    return (
        <Stack>
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="sign_in" options={{ headerShown: false }} />
        </Stack>
    );
}
