from datetime import date

from graphql_relay import from_global_id

from AwakenFit.domains import workout as WorkoutDomain
from AwakenFit.domains import set as SetDomain
from AwakenFit.domains import exercise as ExerciseDomain
from AwakenFit.domains import movement as MovementDomain
from AwakenFit.domains import active_workout_plan as ActiveWorkoutPlanDomain
from AwakenFit.domains import workout_plan as WorkoutPlanDomain


ERROR_MESSAGES = {
    "INVALID_TEMPLATE_NAME": "User already has a template with that name",
    "INVALID_SET_TYPE": "Could not validate the set data provided",
    "INVALID_DATE_VALUES": "Please ensure the startTime is before the stopTime.",
    "INVALID_EQUIPMENT": "Cardio workout should not include barbell or dumbbell as equipment.",
    "INVALID_PLAN_NAME": "User already has a plan with the same name",
    "INVALID_SEQUENCE": "The provided sequence number is already being used",
    "INVALID_DAY": "The provided day number is already being used.",
    "INVALID_REST_DAY": "Did not provide a workout ID and not a Rest day",
    "DESCRIPTION_LENGTH": "Description does not fit the movement requirements.",
    "DUPLICATE_RECORD": "Record already exists, please double check your input.",
    "MISSING_MUSCLE_GROUP": "Primary and secondary muscle group are None, please fill in one.",
    "MISSING_WORKOUT_TWO": "Please populate workout two before workout three",
    "BAD_START_DATE": "Please make sure the start date is today or a future date.",
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
    if not MovementDomain.is_valid_id(from_global_id(movement.id).id):
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


def validate_workout_plan_days_input(days) -> list[str]:
    errors = list()
    seen_sequence_numbers = set()
    seen_day_numbers = set()
    for entry in days:
        entry_errors = list()
        if not entry.workout_one_id and not entry.rest_day:
            entry_errors.append(ERROR_MESSAGES["INVALID_REST_DAY"])
        if entry.workout_one_id and not WorkoutDomain.is_valid_id(from_global_id(entry.workout_one_id).id):
            entry_errors.append(ERROR_MESSAGES["INVALID_ID"])
        if entry.workout_two_id and not WorkoutDomain.is_valid_id(from_global_id(entry.workout_two_id).id):
            entry_errors.append(ERROR_MESSAGES["INVALID_ID"])
        if entry.workout_three_id and not WorkoutDomain.is_valid_id(from_global_id(entry.workout_three_id).id):
            entry_errors.append(ERROR_MESSAGES["INVALID_ID"])
        if entry.workout_three_id and not entry.workout_two_id:
            entry_errors.append(ERROR_MESSAGES["MISSING_WORKOUT_TWO"])
        if not entry_errors:
            current_seq_count = len(seen_sequence_numbers)
            seen_sequence_numbers.add(entry.sequence_number)
            if current_seq_count == len(seen_sequence_numbers):
                entry_errors.append(ERROR_MESSAGES["INVALID_SEQUENCE"])

            current_day_count = len(seen_day_numbers)
            seen_day_numbers.add(entry.day_number)
            if current_day_count == len(seen_day_numbers):
                entry_errors.append(ERROR_MESSAGES["INVALID_DAY"])
        errors.extend(entry_errors)

    return errors


def validate_workout_plan_input(plan, user) -> list[str]:
    errors = list()
    if not WorkoutPlanDomain.is_name_available(user.id, plan.name):
        errors.append(ERROR_MESSAGES["INVALID_PLAN_NAME"])
    errors.extend(validate_workout_plan_days_input(plan.days))

    return errors


def validate_active_workout_plan_input(plan_id: str, start_date: date) -> list[str]:
    errors = list()
    if not WorkoutPlanDomain.is_valid_id(from_global_id(plan_id).id):
        errors.append(ERROR_MESSAGES["INVALID_ID"])
    if not start_date >= date.today():
        errors.append(ERROR_MESSAGES["BAD_START_DATE"])

    return errors
