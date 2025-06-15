from AwakenFit.domains import workout as WorkoutDomain
from AwakenFit.domains import set as SetDomain
from AwakenFit.domains import exercise as ExerciseDomain
from AwakenFit.domains import movement as MovementDomain


ERROR_MESSAGES = {
    "INVALID_TEMPLATE_NAME": "User already has a template with that name",
    "INVALID_SET_TYPE": "Could not validate the set data provided",
    "INVALID_DATE_VALUES": "Please ensure the startTime is before the stopTime.",
    "DESCRIPTION_LENGTH": "Description does not fit the movement requirements.",
    "DUPLICATE_RECORD": "Record already exists, please double check your input.",
    "MISSING_MUSCLE_GROUP": "Primary and secondary muscle group are None, please fill in one.",
    "INVALID_EQUIPMENT": "Cardio workout should not include barbell or dumbbell as equipment.",
    "INVALID_ID": "Provided ID does not exist.",
}


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


def validate_workout_template_input(user_id, workout) -> list[str]:
    errors = list()

    if not WorkoutDomain.is_template_name_available(workout.name, user_id):
        errors.append(ERROR_MESSAGES["INVALID_TEMPLATE_NAME"])

    for exercise in workout.exercises:
        errors.extend(validate_exercise_template_input(exercise))

    return errors


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


def validate_workout_completed_input(workout) -> list[str]:
    errors = list()

    if workout.start_time > workout.stop_time:
        errors.append(ERROR_MESSAGES["INVALID_DATE_VALUES"])

    for exercise in workout.exercises:
        errors.extend(validate_exercise_completed_input(exercise))

    return errors


def validate_movement_create_input(movement) -> list[str]:
    errors = list()
    if len(movement.description) > 500:
        errors.append(ERROR_MESSAGES["DESCRIPTION_LENGTH"])
    if MovementDomain.movement_already_exists(movement.name):
        errors.append(ERROR_MESSAGES["DUPLICATE_RECORD"])
    if movement.primary_muscle_group == "None" and movement.secondary_muscle_group == "None":
        errors.append(ERROR_MESSAGES["MISSING_MUSCLE_GROUP"])
    if movement.movement_type == "Cardio" and (
        movement.equipment_type == "Barbell" or movement.equipment_type == "Dumbell"
    ):
        errors.append(ERROR_MESSAGES["INVALID_EQUIPMENT"])

    return errors


def validate_movement_edit_input(movement) -> list[str]:
    errors = list()
    if not MovementDomain.is_valid_id(movement.id):
        errors.append(ERROR_MESSAGES["INVALID_ID"])
    if movement.description and len(movement.description) > 500:
        errors.append(ERROR_MESSAGES["DESCRIPTION_LENGTH"])
    if movement.primary_muscle_group == "None" and movement.secondary_muscle_group == "None":
        errors.append(ERROR_MESSAGES["MISSING_MUSCLE_GROUP"])
    if movement.movement_type == "Cardio" and (
        movement.equipment_type == "Barbell" or movement.equipment_type == "Dumbell"
    ):
        errors.append(ERROR_MESSAGES["INVALID_EQUIPMENT"])

    return errors
