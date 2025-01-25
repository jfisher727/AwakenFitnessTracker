from typing import Optional

from django.db.models import QuerySet
from django.contrib.auth.models import User

from graphql_relay import from_global_id

from ..models import Exercise

from ..domains import UserDomain
from ..domains import MovementDomain
from ..domains import WorkoutDomain


class ExerciseDomain(object):
    MAX_NOTE_LENGTH = 495
    ERROR_MESSAGES = {"INVALID_INTENSITY": "Intensity value should fall in the range of 1 to 10."}

    @staticmethod
    def get_by_id(id: int) -> Exercise:
        return Exercise.objects.select_related("movement", "workout").get(pk=id)

    @staticmethod
    def get_by_id_set(id_set: list[id]) -> list[Exercise]:
        return Exercise.objects.select_related("movement", "workout").filter(id__in=id_set).all()

    @staticmethod
    def get_by_user_id(id: int) -> list[Exercise]:
        if UserDomain.is_valid_id(id):
            return Exercise.objects.select_related("movement", "workout").filter(workout__user__id=id).all()
        return None

    @staticmethod
    def is_valid_id(id: int) -> bool:
        return Exercise.objects.select_related("movement", "workout").filter(id=id).exists()

    @staticmethod
    def filter_queryset_by_user(queryset: QuerySet, user: User) -> QuerySet:
        return queryset.filter(workout__user=user)

    @staticmethod
    def validate_exercise(exercise) -> list[str]:
        errors = list()

        if not MovementDomain.is_valid_id(from_global_id(exercise.movement_id).id):
            errors.append(MovementDomain.ERROR_MESSAGES["INVALID_ID"])
        if exercise.intensity and (exercise.intensity < 1 or exercise.intensity > 10):
            errors.append(ExerciseDomain.ERROR_MESSAGES["INVALID_INTENSITY"])

        return errors

    @staticmethod
    def create_exercise(movement_id: int, workout_id: int, intensity: int, notes: str) -> Optional[Exercise]:
        created_record = None
        if MovementDomain.is_valid_id(movement_id) and WorkoutDomain.is_valid_id(workout_id):
            movement = MovementDomain.get_by_id(movement_id)
            workout = WorkoutDomain.get_by_id(workout_id)

            if len(notes) > ExerciseDomain.MAX_NOTE_LENGTH:
                notes = notes[: ExerciseDomain.MAX_NOTE_LENGTH]

            created_record = Exercise.objects.create(
                movement=movement, workout=workout, intensity=intensity, notes=notes
            )
        return created_record
