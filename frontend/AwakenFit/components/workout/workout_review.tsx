import { View, Text, FlatList } from "react-native";

import { ExerciseProps, MovementNode, SetNode } from "@/graphql/properties";

import { baseStyles } from "@/styles/global";

import HorzontalLine from "../general/horizonal_line";
import CustomButton from "../general/button";

type reviewParams = {
    exercises: ExerciseProps[],
    start_time: string,
    stop_time: string,
    recordWorkout: () => void,
};

type setParams = {
    item: SetNode,
    movement: MovementNode
}

type exerciseParams = {
    exercise: ExerciseProps
}

type DurationParams = {
    start_time: Date,
    stop_time: Date
}

function SetEntry({ item, movement }: setParams) {
    const equipment_type = movement.equipmentType.toLowerCase();
    const movement_type = movement.movementType.toLowerCase();

    if (equipment_type == "none" || equipment_type == "body only" || equipment_type == "exercise ball") {
        if (movement_type == "cardio") {
            // duration input
            return (
                <View style={baseStyles.spacedRow}>
                    <Text>Set {item.sequenceNumber}</Text>
                    <Text>Duration: {item.duration}</Text>
                </View>
            );
        } else {
            return (
                <View style={baseStyles.spacedRow}>
                    <Text>Set {item.sequenceNumber}</Text>
                    <Text>Reps: {item.equipment_identifier}</Text>
                </View>
            );
        }
    }
    else if (equipment_type == "resistence bands" || equipment_type == "resistance bands") {
        // identifier and reps
        return (
            <View style={baseStyles.spacedRow}>
                <Text>Set {item.sequenceNumber}</Text>
                <Text>Identifier: {item.equipment_identifier}</Text>
                <Text>Reps: {item.completedReps}</Text>
            </View>
        );
    }
    else {
        // weight and reps
        return (
            <View style={baseStyles.spacedRow}>
                <Text>Set {item.sequenceNumber}</Text>
                <Text>Weight: {item.weight}</Text>
                <Text>Reps: {item.completedReps}</Text>
            </View>
        );
    }
}

function ExerciseEntry({ exercise }: exerciseParams) {

    return (
        <View>
            <Text style={baseStyles.subHeader}>{exercise.movement.name}</Text>
            <FlatList
                data={exercise.sets}
                renderItem={({ item }) => <SetEntry item={item} movement={exercise.movement} />}
            />
        </View>
    );
}

function DurationComponent({ start_time, stop_time }: DurationParams) {
    const startTimeDate = new Date(start_time);
    const stopTimeDate = new Date(stop_time);
    const workoutDurationMs = stopTimeDate.getTime() - startTimeDate.getTime();
    const diffInSeconds = Math.floor(workoutDurationMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    return (
        <View style={baseStyles.centeredRow}>
            <Text>Duration:</Text>
            {
                diffInHours > 0 &&
                <Text>{diffInHours}H:</Text>
            }
            <Text>{diffInMinutes % 60}M:</Text>
            <Text>{diffInSeconds % 60}S</Text>
        </View>
    );
}

export default function WorkoutReview({ exercises, start_time, stop_time, recordWorkout }: reviewParams) {

    function handleRecordWorkout() {
        recordWorkout();
    }
    const startTimeDate = new Date(start_time);
    const stopTimeDate = new Date(stop_time);
    // we should let users tap on various items to edit their values?
    return (
        <View>
            <Text style={baseStyles.header}>Workout Review</Text>
            <Text>Start: {startTimeDate.getHours()}:{startTimeDate.getMinutes()}</Text>
            <Text>End: {stopTimeDate.getHours()}:{stopTimeDate.getMinutes()}</Text>
            <DurationComponent start_time={startTimeDate} stop_time={stopTimeDate} />
            <HorzontalLine />
            <FlatList
                data={exercises}
                renderItem={({ item }) => <ExerciseEntry exercise={item} />}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={HorzontalLine}
            />
            <CustomButton
                text='Record Workout'
                onPress={handleRecordWorkout}
                disabled={false}
            />
        </View>
    );
}
