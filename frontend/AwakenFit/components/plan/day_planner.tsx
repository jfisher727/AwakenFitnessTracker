import { useState } from "react";
import { View, Text, useColorScheme, FlatList } from "react-native";

import { baseStyles, lightColors, darkColors } from "@/styles/global";

import { WorkoutNodeEdge } from "@/graphql/types";

import CustomButton from "../general/button";
import DropdownSelect from "../general/dropdown_select";

type keyvalue = {
    key: string;
    value: string;
};

type workoutEntryParams = {
    index: number;
    workout: keyvalue;
    color: string;
};

function WorkoutEntry({ index, workout, color }: workoutEntryParams) {
    return (
        <View>
            <Text style={{ color: color }}>
                Workout {index + 1}: {workout.value}
            </Text>
        </View>
    );
}

type params = {
    templates: WorkoutNodeEdge[];
    day_number: number;
    save_day: (
        dayNumber: number,
        workoutOneId: string,
        workoutTwoId?: string,
        workoutThreeId?: string
    ) => void;
    add_rest_day: () => void;
};

export default function DayPlanner({
    templates,
    day_number,
    save_day,
    add_rest_day,
}: params) {
    const colorScheme = useColorScheme();
    const [currentSelection, setCurrentSelection] = useState({
        key: "",
        value: "",
    });
    const [workoutsSelected, setWorkoutsSelected] = useState<keyvalue[]>([]);
    const [showAddWorkout, setShowAddWorkout] = useState(false);

    const textColor =
        colorScheme === "light"
            ? lightColors.primaryColor
            : darkColors.primaryColor;

    const templateOptions: keyvalue[] = templates.map((template) => {
        return {
            key: template.node?.id || "",
            value: template.node?.name || "",
        };
    });

    function handleWorkoutSelected() {
        if (workoutsSelected.length < 3) {
            setWorkoutsSelected([...workoutsSelected, currentSelection]);
        }
    }

    function handleSaveDay() {
        console.log("save day called");
        if (workoutsSelected.length > 0) {
            save_day(
                day_number,
                workoutsSelected[0].key,
                workoutsSelected[1]?.key,
                workoutsSelected[2]?.key
            );
            setWorkoutsSelected([]);
            setShowAddWorkout(false);
        } else {
            add_rest_day();
        }
    }

    function toggleShowAddWorkout() {
        setShowAddWorkout(!showAddWorkout);
    }

    return (
        <View>
            <Text style={{ ...baseStyles.subHeader, color: textColor }}>
                Plan - Day {day_number}
            </Text>
            {workoutsSelected.length === 0 && (
                <>
                    <Text style={{ ...baseStyles.text, color: textColor }}>
                        Rest Day?
                    </Text>
                    <CustomButton
                        text="Add Workout"
                        onPress={toggleShowAddWorkout}
                        disabled={false}
                    />
                </>
            )}
            {showAddWorkout && (
                <>
                    <DropdownSelect
                        placeHolder="Your Workout Templates"
                        selectedValue={currentSelection}
                        options={templateOptions}
                        onSelect={setCurrentSelection}
                        showSearch={false}
                    />
                    <CustomButton
                        text="Add Selection"
                        onPress={handleWorkoutSelected}
                        disabled={workoutsSelected.length >= 3}
                    />
                </>
            )}
            <View style={{ paddingTop: 30 }}>
                {workoutsSelected.length > 0 && (
                    <FlatList
                        data={workoutsSelected}
                        renderItem={({ item, index }) => (
                            <WorkoutEntry
                                workout={item}
                                index={index}
                                color={textColor}
                            />
                        )}
                        keyExtractor={(item) => item.key}
                    />
                )}
                <CustomButton
                    text="Save Day"
                    onPress={handleSaveDay}
                    disabled={false}
                />
            </View>
        </View>
    );
}
