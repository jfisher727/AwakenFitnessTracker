import { Stack } from "expo-router";

import { SessionProvider } from "../auth/AuthContext";


export default function RootLayout() {

    return (
        <SessionProvider>
            <Stack>
                <Stack.Screen name="sign-in" />
                <Stack.Screen name="(app)" />
            </Stack>
        </SessionProvider>
    );
}
