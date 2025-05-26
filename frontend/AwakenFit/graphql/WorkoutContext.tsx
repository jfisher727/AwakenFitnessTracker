import { createContext, useState, useContext, type PropsWithChildren } from "react";

const WorkoutContext = createContext<{
    startWorkout: () => void;
    stopWorkout: () => void;
    isWorkoutActive: boolean;
}>({
    startWorkout: () => null,
    stopWorkout: () => null,
    isWorkoutActive: false,
});

export function useWorkout() {
    const value = useContext(WorkoutContext);
    if (process.env.NODE_ENV !== "production") {
        if (!value) {
            throw new Error("useSession must be wrapped in a <SessionProvider />");
        }
    }

    return value;
}

export const WorkoutProvider = ({ children }: PropsWithChildren) => {
    const [isWorkoutActive, setIsWorkoutActive] = useState(false);

    return (
        <WorkoutContext.Provider
            value={{
                startWorkout: () => {
                    setIsWorkoutActive(true);
                },
                stopWorkout: () => {
                    setIsWorkoutActive(false);
                },
                isWorkoutActive
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
};
