import { View, Text, FlatList } from "react-native";

import { ExerciseProps, SetNode } from "@/graphql/properties";

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
}

type exerciseParams = {
    item: ExerciseProps
}

type DurationParams = {
    start_time: Date,
    stop_time: Date
}

function SetEntry({ item }: setParams) {
    return (
        <View>
            <Text>Set {item.sequenceNumber}</Text>
            {
                (item.completedReps && item.completedReps > 0) &&
                <Text>Reps: {item.completedReps}</Text>
            }
            {
                (item.weight && item.weight > 0) &&
                <Text>Weight: {item.weight}</Text>
            }
        </View>
    );
}

function ExerciseEntry({ item }: exerciseParams) {

    return (
        <View>
            <Text>{item.movement.name}</Text>
            <FlatList
                data={item.sets}
                renderItem={({ item }) => <SetEntry item={item} />}
            />
        </View>
    );
}

function DurationComponent({ start_time, stop_time }: DurationParams) {
    const startTimeDate = new Date(start_time);
    const stopTimeDate = new Date(stop_time);
    const workoutDurationMs = stopTimeDate.getTime() - startTimeDate.getTime();
    const diffInSeconds = workoutDurationMs / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;

    return (
        <View>
            <Text>Duration:</Text>
            {
                diffInHours > 0 &&
                <Text>{diffInHours}H:</Text>
            }
            <Text>{diffInMinutes}M:</Text>
            <Text>{diffInSeconds}S</Text>
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
            <Text>Workout Review</Text>
            <Text>Start: {startTimeDate.getHours()}:{startTimeDate.getMinutes()}</Text>
            <Text>End: {stopTimeDate.getHours()}:{stopTimeDate.getMinutes()}</Text>
            <DurationComponent start_time={startTimeDate} stop_time={stopTimeDate} />
            <HorzontalLine />
            <FlatList
                data={exercises}
                renderItem={({ item }) => <ExerciseEntry item={item} />}
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
