from . import ExerciseDomain
from . import SetDomain


class MutationDomain(object):
    ERROR_MESSAGES = {
        "INVALID_SET_TYPE": "Could not validate the set data provided",
        "INVALID_DATE_VALUES": "Please ensure the startTime is before the stopTime.",
    }

    @staticmethod
    def validate_exercise_template_input(exercise) -> list[str]:
        errors = list()

        errors.extend(ExerciseDomain.validate_exercise(exercise))

        if exercise.standard_sets:
            for standard_set in exercise.standard_sets:
                errors.extend(SetDomain.validate_template_standard_set(standard_set))
        if exercise.non_standard_sets:
            for non_standard_set in exercise.non_standard_sets:
                errors.extend(SetDomain.validate_template_non_standard_set(non_standard_set))

        return errors

    @staticmethod
    def validate_workout_template_input(workout) -> list[str]:
        errors = list()

        for exercise in workout.exercises:
            errors.extend(MutationDomain.validate_exercise_template_input(exercise))

        return errors

    @staticmethod
    def validate_exercise_completed_input(exercise) -> list[str]:
        errors = list()

        errors.extend(ExerciseDomain.validate_exercise(exercise))

        if exercise.standard_sets:
            for standard_set in exercise.standard_sets:
                errors.extend(SetDomain.validate_completed_standard_set(standard_set))
        if exercise.non_standard_sets:
            for non_standard_set in exercise.non_standard_sets:
                errors.extend(SetDomain.validate_completed_non_standard_set(non_standard_set))

        return errors

    @staticmethod
    def validate_workout_completed_input(workout) -> list[str]:
        errors = list()

        if workout.start_time > workout.stop_time:
            errors.append(MutationDomain.ERROR_MESSAGES["INVALID_DATE_VALUES"])

        for exercise in workout.exercises:
            errors.extend(MutationDomain.validate_exercise_completed_input(exercise))

        return errors
