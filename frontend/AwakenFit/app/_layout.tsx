import { Stack } from "expo-router";

import { SessionProvider } from "../auth/AuthContext";

export default function RootLayout() {
    return (
        <SessionProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
            </Stack>
        </SessionProvider>
    );
}
