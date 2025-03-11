import { Stack } from "expo-router";


export default function WorkoutLayout() {

    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="blank_workout" />
            <Stack.Screen name="template_workout" />
            <Stack.Screen name="modal" options={{
                title: "Start a Workout"
            }} />
        </Stack>
    );
}
