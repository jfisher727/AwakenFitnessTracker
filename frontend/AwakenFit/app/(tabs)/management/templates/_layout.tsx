import { Stack } from "expo-router";

export default function TemplatesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="create" />
            <Stack.Screen name="list" />
        </Stack>
    );
}
