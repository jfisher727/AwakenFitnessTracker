export type ExerciseProps = {
    id: string,
    notes: string,
    movement: {
        name: string,
        description: string,
        primaryMuscleGroup: string,
        equipmentType: string,
        movementType: string
    },
    sets: {
        id: string,
        sequenceNumber: number,
        minReps: number,
        maxReps: number,
        duration: string,
        setType: string,
        parentSet: string
    }[]
};

export type WorkoutProps = {
    cursor: string,
    node: {
        id: string,
        name: string,
        notes: string,
        exercises: ExerciseProps[],
    }
};
