import { Stack } from "expo-router";

import { SessionProvider } from "../auth/AuthContext";

export default function RootLayout() {
    return (
        <SessionProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="welcome" />
                <Stack.Screen name="account" />
            </Stack>
        </SessionProvider>
    );
}
