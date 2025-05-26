export type SetNode = {
    id?: string,
    sequenceNumber: number,
    minReps: number,
    maxReps: number,
    completedReps?: number,
    duration?: string,
    weight?: number,
    equipment_identifier?: string,
    setType?: string,
    parentSet?: string
};

export type MovementNode = {
    id: string,
    name: string,
    description: string,
    primaryMuscleGroup: string,
    equipmentType: String,
    movementType: String
};

export type ExerciseProps = {
    id: string,
    notes: string,
    movement: MovementNode,
    sets: SetNode[]
};

export type WorkoutNode = {
    id?: string,
    name: string,
    notes?: string,
    exercises: ExerciseProps[],
};

export type WorkoutProps = {
    cursor: string,
    node: WorkoutNode
};
