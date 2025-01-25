from typing import Optional

from django.db.models import QuerySet
from django.contrib.auth.models import User

from ..models import Exercise
from ..models import Set

from ..domains import ExerciseDomain


class SetDomain(object):
    ERROR_MESSAGES = {
        "INVALID_SET_TYPE": "The provided set type couldn't be validated.",
        "COMPLETED_SETS": "Completed sets should contain at least one of the following: completed_reps, weight, duration. completed_reps and duration should not be included together.",
        "TEMPLATE_SETS": "Template sets should contain min_reps/max_reps or duration, not both.",
        "INVALID_VALUE": "Provided a value that should be greater than 0.",
        "BAD_TEMPLATE_REPS": "Please make sure min_reps is less than max_reps for templates.",
        "MISSING_SET_TYPE": "Please be sure to include set_type for non-standard sets.",
    }

    @staticmethod
    def get_by_id(id: int) -> Set:
        return Set.objects.select_related("exercise").get(pk=id)

    @staticmethod
    def get_by_id_set(id_set: list[int]) -> list[Set]:
        return Set.objects.select_related("exercise").filter(id__in=id_set).all()

    @staticmethod
    def get_by_exercise_id(id: int) -> list[Set]:
        return Set.objects.select_related("exercise").filter(exercise__id=id).all()

    @staticmethod
    def get_by_user_id(id: int) -> list[Set]:
        return Set.objects.select_related("exercise__workout__user").filter(exercise__workout__user__id=id).all()

    @staticmethod
    def is_valid_id(id: int) -> bool:
        return Set.objects.filter(id=id).exists()

    @staticmethod
    def calculate_one_rep_max(input: Set) -> int:
        return int(((input.weight * input.completed_reps) / 30.48) + input.weight)

    @staticmethod
    def calculate_set_volume(input: Set) -> int:
        return input.completed_reps * input.weight

    @staticmethod
    def filter_queryset_by_user(queryset: QuerySet, user: User) -> QuerySet:
        return queryset.filter(exercise__workout__user=user)

    @staticmethod
    def validate_template_standard_set(standard_set) -> list[str]:
        errors = list()

        if (standard_set.min_reps or standard_set.max_reps) and standard_set.duration:
            errors.append(SetDomain.ERROR_MESSAGES["TEMPLATE_SETS"])

        if standard_set.min_reps and standard_set.max_reps:
            if standard_set.min_reps > standard_set.max_reps:
                errors.append(SetDomain.ERROR_MESSAGES["BAD_TEMPLATE_REPS"])

        return errors

    @staticmethod
    def validate_completed_standard_set(standard_set) -> list[str]:
        errors = list()
        if standard_set.sequence_number and standard_set.sequence_number < 1:
            errors.append(SetDomain.ERROR_MESSAGES["INVALID_VALUE"])
        if standard_set.completed_reps and standard_set.completed_reps < 1:
            errors.append(SetDomain.ERROR_MESSAGES["INVALID_VALUE"])
        if standard_set.weight and standard_set.weight < 1:
            errors.append(SetDomain.ERROR_MESSAGES["INVALID_VALUE"])

        if standard_set.completed_reps and standard_set.duration:
            errors.append(SetDomain.ERROR_MESSAGES["COMPLETED_SETS"])
        if not (standard_set.completed_reps or standard_set.weight or standard_set.duration):
            errors.append(SetDomain.ERROR_MESSAGES["COMPLETED_SETS"])

        return errors

    @staticmethod
    def validate_template_non_standard_set(non_standard_set) -> list[str]:
        errors = list()

        if not non_standard_set.set_type:
            errors.append(SetDomain.ERROR_MESSAGES["MISSING_SET_TYPE"])
        elif not any(non_standard_set.set_type in choice for choice in Set.SET_TYPE_CHOICES):
            errors.append(SetDomain.ERROR_MESSAGES["INVALID_SET_TYPE"])

        for standard_set in non_standard_set.associated_sets:
            errors.extend(SetDomain.validate_template_standard_set(standard_set))

        return errors

    @staticmethod
    def validate_completed_non_standard_set(non_standard_set) -> list[str]:
        errors = list()

        if not non_standard_set.set_type:
            errors.append(SetDomain.ERROR_MESSAGES["MISSING_SET_TYPE"])
        elif not any(non_standard_set.set_type in choice for choice in Set.SET_TYPE_CHOICES):
            errors.append(SetDomain.ERROR_MESSAGES["INVALID_SET_TYPE"])

        for standard_set in non_standard_set.associated_sets:
            errors.extend(SetDomain.validate_completed_standard_set(standard_set))

        return errors

    @staticmethod
    def create_parent_non_standard_set(
        exercise_id: int,
        set_type: str,
    ) -> Optional[Set]:
        created_record = None
        if ExerciseDomain.is_valid_id(exercise_id):
            exercise = ExerciseDomain.get_by_id(exercise_id)

            created_record = SetDomain._create_set(
                exercise,
                set_type=set_type,
            )
        return created_record

    @staticmethod
    def create_template_set(
        exercise_id: int,
        sequence_number: int,
        min_reps: int = 0,
        max_reps: int = 0,
        duration: str = "",
        set_type: str = Set.STANDARD,
        parent_set: Set = None,
    ) -> Optional[Set]:
        created_record = None
        if ExerciseDomain.is_valid_id(exercise_id):
            exercise = ExerciseDomain.get_by_id(exercise_id)

            created_record = SetDomain._create_set(
                exercise,
                sequence_number=sequence_number,
                min_reps=min_reps,
                max_reps=max_reps,
                duration=duration,
                set_type=set_type,
                parent_set=parent_set,
            )
        return created_record

    @staticmethod
    def create_completed_set(
        exercise_id: int,
        sequence_number: int,
        completed_reps: int = 0,
        weight: int = 0,
        duration: str = "",
        set_type: str = Set.STANDARD,
        parent_set: Set = None,
    ) -> Optional[Set]:
        created_record = None
        if ExerciseDomain.is_valid_id(exercise_id):
            exercise = ExerciseDomain.get_by_id(exercise_id)

            created_record = SetDomain._create_set(
                exercise,
                sequence_number=sequence_number,
                completed_reps=completed_reps,
                weight=weight,
                duration=duration,
                set_type=set_type,
                parent_set=parent_set,
            )
        return created_record

    @staticmethod
    def _create_set(
        exercise: Exercise,
        sequence_number: int = 1,
        completed_reps: int = 0,
        min_reps: int = 0,
        max_reps: int = 0,
        weight: int = 0,
        duration: str = "",
        set_type: str = Set.STANDARD,
        parent_set: Set = None,
    ) -> Optional[Set]:
        return Set.objects.create(
            exercise=exercise,
            sequence_number=sequence_number,
            completed_reps=completed_reps,
            min_reps=min_reps,
            max_reps=max_reps,
            weight=weight,
            duration=duration,
            set_type=set_type,
            parent_set=parent_set,
        )
