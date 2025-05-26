import { gql } from "@apollo/client";

export const GET_WORKOUT_TEMPLATES = gql`
    query GetWorkoutTemplates(
        $after: String,
        $count: Int,
        $name: String,
        $template: Boolean) {
            workouts(
                after: $after,
                first: $count,
                name_Icontains: $name,
                template: $template) {
                    edges {
                        cursor
                        node {
                            id
                            name
                            notes
                            exercises {
                                id
                                notes
                                movement {
                                    name
                                    description
                                    primaryMuscleGroup
                                    equipmentType
                                    movementType
                                }
                                sets {
                                    id
                                    sequenceNumber
                                    minReps
                                    maxReps
                                    duration
                                    setType
                                }
                            }
                        }
                    }
            }
    }
`;
