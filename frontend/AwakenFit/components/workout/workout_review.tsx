import { View, Text, Pressable, FlatList, useColorScheme } from "react-native";

import { ExerciseProps, MovementNode, SetNode } from "@/graphql/properties";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import HorzontalLine from "../general/horizonal_line";
import CustomButton from "../general/button";

type reviewParams = {
    exercises: ExerciseProps[];
    start_time: string;
    stop_time: string;
    recordWorkout: () => void;
    setCurrentExercise: (id: string) => void;
};

type setParams = {
    item: SetNode;
    movement: MovementNode;
};

type exerciseParams = {
    exercise: ExerciseProps;
    setCurrentExercise: (id: string) => void;
};

type DurationParams = {
    start_time: Date;
    stop_time: Date;
};

function SetEntry({ item, movement }: setParams) {
    const colorScheme = useColorScheme();
    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;
    const equipment_type = movement.equipmentType.toLowerCase();
    const movement_type = movement.movementType.toLowerCase();

    if (movement_type == "cardio") {
        // duration input
        return (
            <View
                style={{
                    ...baseStyles.spacedRow,
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
            >
                <Text style={{ color: color }}>Set {item.sequenceNumber}</Text>
                <Text style={{ color: color }}>Duration: {item.duration}</Text>
            </View>
        );
    } else if (
        equipment_type == "none" ||
        equipment_type == "body only" ||
        equipment_type == "exercise ball"
    ) {
        return (
            <View
                style={{
                    ...baseStyles.spacedRow,
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
            >
                <Text style={{ color: color }}>Set {item.sequenceNumber}</Text>
                <Text style={{ color: color }}>Reps: {item.completedReps}</Text>
            </View>
        );
    } else if (
        equipment_type == "resistence bands" ||
        equipment_type == "resistance bands"
    ) {
        // identifier and reps
        return (
            <View
                style={{
                    ...baseStyles.spacedRow,
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
            >
                <Text style={{ color: color }}>Set {item.sequenceNumber}</Text>
                <Text style={{ color: color }}>
                    Identifier: {item.equipmentIdentifier}
                </Text>
                <Text style={{ color: color }}>Reps: {item.completedReps}</Text>
            </View>
        );
    } else {
        // weight and reps
        return (
            <View
                style={{
                    ...baseStyles.spacedRow,
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
            >
                <Text style={{ color: color }}>Set {item.sequenceNumber}</Text>
                <Text style={{ color: color }}>Weight: {item.weight}</Text>
                <Text style={{ color: color }}>Reps: {item.completedReps}</Text>
            </View>
        );
    }
}

function ExerciseEntry({ exercise, setCurrentExercise }: exerciseParams) {
    const colorScheme = useColorScheme();
    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;
    return (
        <Pressable onPress={() => setCurrentExercise(exercise.id)}>
            <Text style={{ ...baseStyles.subHeader, color: color }}>
                {exercise.movement.name}
            </Text>
            <FlatList
                data={exercise.sets}
                renderItem={({ item }) => (
                    <SetEntry item={item} movement={exercise.movement} />
                )}
            />
        </Pressable>
    );
}

function DurationComponent({ start_time, stop_time }: DurationParams) {
    const colorScheme = useColorScheme();
    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;
    const startTimeDate = new Date(start_time);
    const stopTimeDate = new Date(stop_time);
    const workoutDurationMs = stopTimeDate.getTime() - startTimeDate.getTime();
    const diffInSeconds = Math.floor(workoutDurationMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    return (
        <View style={baseStyles.centeredRow}>
            <Text style={{ color: color }}>Duration:</Text>
            {diffInHours > 0 && (
                <Text style={{ color: color }}>{diffInHours}H:</Text>
            )}
            <Text style={{ color: color }}>{diffInMinutes % 60}M:</Text>
            <Text style={{ color: color }}>{diffInSeconds % 60}S</Text>
        </View>
    );
}

export default function WorkoutReview({
    exercises,
    start_time,
    stop_time,
    setCurrentExercise,
    recordWorkout,
}: reviewParams) {
    const colorScheme = useColorScheme();
    const color =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

    function handleRecordWorkout() {
        recordWorkout();
    }
    const startTimeDate = new Date(start_time);
    const stopTimeDate = new Date(stop_time);
    return (
        <View style={{ height: "100%", overflow: "scroll" }}>
            <Text style={{ ...baseStyles.header, color: color }}>
                Workout Review
            </Text>
            <Text style={{ ...baseStyles.subHeader, color: color }}>
                Start: {startTimeDate.getHours()}:
                {startTimeDate.getMinutes().toString().padStart(2, "0")}
            </Text>
            <Text style={{ ...baseStyles.subHeader, color: color }}>
                End: {stopTimeDate.getHours()}:
                {stopTimeDate.getMinutes().toString().padStart(2, "0")}
            </Text>
            <DurationComponent
                start_time={startTimeDate}
                stop_time={stopTimeDate}
            />
            <HorzontalLine />
            <FlatList
                data={exercises}
                renderItem={({ item }) => (
                    <ExerciseEntry
                        exercise={item}
                        setCurrentExercise={setCurrentExercise}
                    />
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={HorzontalLine}
            />
            <CustomButton
                text="Record Workout"
                onPress={handleRecordWorkout}
                disabled={false}
            />
        </View>
    );
}
