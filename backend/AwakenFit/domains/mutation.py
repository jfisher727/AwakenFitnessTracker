from graphene import Int

from . import ExerciseDomain
from . import SetDomain


class MutationDomain(object):
    ERROR_MESSAGES = {"INVALID_SET_TYPE": "Couldn't validate the set data provided"}

    @staticmethod
    def validate_set_input(set_input) -> list[str]:
        errors = list()

        # these are standard sets
        if isinstance(set_input, "SetCreateCompletedInput"):
            errors.append(SetDomain.validate_standard_set(set_input))
        if isinstance(set_input, "SetCreateTemplateInput"):
            errors.append(SetDomain.validate_standard_set(set_input))

        # these are non-standard sets
        elif isinstance(set_input, "SetCreateCompletedParentInput") or isinstance(
            set_input, "SetCreateTemplateParentInput"
        ):
            errors.append(SetDomain.validate_non_standard_set(set_input))

        # couldn't validate their type
        else:
            errors.append(MutationDomain.ERROR_MESSAGES["INVALID_SET_TYPE"])

        return errors

    @staticmethod
    def validate_exercise_input(exercise) -> list[str]:
        errors = list()
        exercise.intensity = Int.coerce_int(exercise.intensity)
        errors.append(ExerciseDomain.validate_exercise(exercise))

        if exercise.standard_set:
            for standard_set in exercise.standard_sets:
                errors.append(MutationDomain.validate_set_input(standard_set))
        if exercise.non_standard_sets:
            for non_standard_set in exercise.non_standard_sets:
                errors.append(MutationDomain.validate_set_input(non_standard_set))

        return errors

    @staticmethod
    def validate_workout_input(workout) -> list[str]:
        errors = list()

        for exercise in workout.exercises:
            errors.append(MutationDomain.validate_exercise_input(exercise))

        return errors
