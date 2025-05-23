from django.db.models import QuerySet
from django.contrib.auth.models import User

from AwakenFit.models import Exercise, Set

from AwakenFit.domains import exercise as ExerciseDomain


ERROR_MESSAGES = {
    "INVALID_SET_TYPE": "The provided set type couldn't be validated.",
    "COMPLETED_SETS": "Completed sets should contain at least one of the following: completedReps, weight, duration. completed_reps and duration should not be included together.",
    "TEMPLATE_SETS": "Template sets should contain min_reps/max_reps or duration, not both.",
    "INVALID_VALUE": "Provided a value that should be greater than 0.",
    "BAD_DURATION_INPUT": "The duration input dont follow the expected format (HH:MM:SS).",
    "BAD_TEMPLATE_REPS": "Please make sure min_reps is less than max_reps for templates.",
    "MISSING_SET_TYPE": "Please be sure to include set_type for non-standard sets.",
}


def get_by_id(id: int) -> Set:
    return Set.objects.select_related("exercise").get(pk=id)


def get_by_id_set(id_set: list[int]) -> list[Set]:
    return Set.objects.select_related("exercise").filter(id__in=id_set).all()


def get_by_exercise_id(id: int) -> list[Set]:
    return Set.objects.select_related("exercise").filter(exercise__id=id).all()


def get_by_user_id(id: int) -> list[Set]:
    return Set.objects.select_related("exercise__workout__user").filter(exercise__workout__user__id=id).all()


def is_valid_id(id: int) -> bool:
    return Set.objects.filter(id=id).exists()


def calculate_one_rep_max(input: Set) -> int:
    if input.completed_reps == 0 or input.weight == 0:
        return 0

    return int(((input.weight * input.completed_reps) / 30.48) + input.weight)


def calculate_set_volume(input: Set) -> int:
    return input.completed_reps * input.weight


def filter_queryset_by_user(queryset: QuerySet, user: User) -> QuerySet:
    return queryset.filter(exercise__workout__user=user)


def validate_template_standard_set(standard_set) -> list[str]:
    errors = list()

    if (standard_set.min_reps or standard_set.max_reps) and standard_set.duration:
        errors.append(ERROR_MESSAGES["TEMPLATE_SETS"])

    if standard_set.min_reps and standard_set.max_reps:
        if standard_set.min_reps > standard_set.max_reps:
            errors.append(ERROR_MESSAGES["BAD_TEMPLATE_REPS"])
    return errors


def validate_completed_standard_set(standard_set) -> list[str]:
    errors = list()
    if standard_set.sequence_number and standard_set.sequence_number < 1:
        errors.append(ERROR_MESSAGES["INVALID_VALUE"])
    if standard_set.completed_reps and standard_set.completed_reps < 1:
        errors.append(ERROR_MESSAGES["INVALID_VALUE"])
    if standard_set.weight and standard_set.weight < 1:
        errors.append(ERROR_MESSAGES["INVALID_VALUE"])
    if standard_set.duration:
        if not ":" in standard_set.duration:
            errors.append(ERROR_MESSAGES["BAD_DURATION_INPUT"])
        duration_parts = standard_set.duration.split(":")
        if len(duration_parts) != 3:
            errors.append(ERROR_MESSAGES["BAD_DURATION_INPUT"])
        for part in duration_parts:
            if len(part) != 2 or not part.isdigit():
                errors.append(ERROR_MESSAGES["BAD_DURATION_INPUT"])

    if standard_set.completed_reps and standard_set.duration:
        errors.append(ERROR_MESSAGES["COMPLETED_SETS"])
    if not (standard_set.completed_reps or standard_set.weight or standard_set.duration):
        errors.append(ERROR_MESSAGES["COMPLETED_SETS"])

    return errors


def validate_template_non_standard_set(non_standard_set) -> list[str]:
    errors = list()

    if not non_standard_set.set_type:
        errors.append(ERROR_MESSAGES["MISSING_SET_TYPE"])
    elif not any(non_standard_set.set_type in choice for choice in Set.SET_TYPE_CHOICES):
        errors.append(ERROR_MESSAGES["INVALID_SET_TYPE"])

    for standard_set in non_standard_set.associated_sets:
        errors.extend(validate_template_standard_set(standard_set))

    return errors


def validate_completed_non_standard_set(non_standard_set) -> list[str]:
    errors = list()

    if not non_standard_set.set_type:
        errors.append(ERROR_MESSAGES["MISSING_SET_TYPE"])
    elif not any(non_standard_set.set_type in choice for choice in Set.SET_TYPE_CHOICES):
        errors.append(ERROR_MESSAGES["INVALID_SET_TYPE"])

    for standard_set in non_standard_set.associated_sets:
        errors.extend(validate_completed_standard_set(standard_set))

    return errors


def create_parent_non_standard_set(
    exercise_id: int,
    set_type: str,
) -> Set | None:
    created_record = None
    if ExerciseDomain.is_valid_id(exercise_id):
        exercise = ExerciseDomain.get_by_id(exercise_id)

        created_record = _create_set(
            exercise,
            set_type=set_type,
        )
    return created_record


def create_template_set(
    exercise_id: int,
    sequence_number: int,
    min_reps: int = 0,
    max_reps: int = 0,
    duration: str = "",
    set_type: str = Set.STANDARD,
    parent_set: Set = None,
) -> Set | None:
    created_record = None
    if ExerciseDomain.is_valid_id(exercise_id):
        exercise = ExerciseDomain.get_by_id(exercise_id)

        created_record = _create_set(
            exercise,
            sequence_number=sequence_number,
            min_reps=min_reps,
            max_reps=max_reps,
            duration=duration,
            set_type=set_type,
            parent_set=parent_set,
        )
    return created_record


def create_completed_set(
    exercise_id: int,
    sequence_number: int,
    completed_reps: int = 0,
    weight: int = 0,
    duration: str = "",
    equipment_identifier: str = "",
    set_type: str = Set.STANDARD,
    parent_set: Set = None,
) -> Set | None:
    created_record = None
    if ExerciseDomain.is_valid_id(exercise_id):
        exercise = ExerciseDomain.get_by_id(exercise_id)

        created_record = _create_set(
            exercise,
            sequence_number=sequence_number,
            completed_reps=completed_reps,
            weight=weight,
            duration=duration,
            equipment_identifier=equipment_identifier,
            set_type=set_type,
            parent_set=parent_set,
        )
    return created_record


def _create_set(
    exercise: Exercise,
    sequence_number: int = 1,
    completed_reps: int = 0,
    min_reps: int = 0,
    max_reps: int = 0,
    weight: int = 0,
    duration: str = "",
    equipment_identifier: str = "",
    set_type: str = Set.STANDARD,
    parent_set: Set = None,
) -> Set | None:
    return Set.objects.create(
        exercise=exercise,
        sequence_number=sequence_number,
        completed_reps=completed_reps,
        min_reps=min_reps,
        max_reps=max_reps,
        weight=weight,
        duration=duration,
        equipment_identifier=equipment_identifier,
        set_type=set_type,
        parent_set=parent_set,
    )
