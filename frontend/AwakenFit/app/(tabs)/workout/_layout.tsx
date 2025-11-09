import { Stack } from "expo-router";

export default function WorkoutLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="template_workout" />
            <Stack.Screen name="modal" />
        </Stack>
    );
}
