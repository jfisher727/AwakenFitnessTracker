import { Stack } from "expo-router";


export default function WorkoutLayout() {

    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: false
            }} />
            <Stack.Screen name="template_workout" options={{
                title: "",
                headerBackTitle: "Back",
            }} />
            <Stack.Screen name="modal" options={{
                title: "Start a Workout",
                headerBackVisible: false
            }} />
        </Stack>
    );
}
