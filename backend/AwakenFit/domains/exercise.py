from typing import Optional

from django.db.models import QuerySet
from django.contrib.auth.models import User

from graphql_relay import from_global_id

from AwakenFit.models import Exercise

from AwakenFit.domains import user as UserDomain
from AwakenFit.domains import movement as MovementDomain
from AwakenFit.domains import workout as WorkoutDomain


MAX_NOTE_LENGTH = 495
ERROR_MESSAGES = {"INVALID_INTENSITY": "Intensity value should fall in the range of 1 to 10."}


def get_by_id(id: int) -> Exercise:
    return Exercise.objects.select_related("movement", "workout").get(pk=id)


def get_by_id_set(id_set: list[id]) -> list[Exercise]:
    return Exercise.objects.select_related("movement", "workout").filter(id__in=id_set).all()


def get_by_user_id(id: int) -> list[Exercise]:
    if UserDomain.is_valid_id(id):
        return Exercise.objects.select_related("movement", "workout").filter(workout__user__id=id).all()
    return None


def is_valid_id(id: int) -> bool:
    return Exercise.objects.select_related("movement", "workout").filter(id=id).exists()


def filter_queryset_by_user(queryset: QuerySet, user: User) -> QuerySet:
    return queryset.filter(workout__user=user)


def validate_exercise(exercise) -> list[str]:
    errors = list()

    if not MovementDomain.is_valid_id(from_global_id(exercise.movement_id).id):
        errors.append(MovementDomain.ERROR_MESSAGES["INVALID_ID"])
    if exercise.intensity and (exercise.intensity < 1 or exercise.intensity > 10):
        errors.append(ERROR_MESSAGES["INVALID_INTENSITY"])

    return errors


def create_exercise(movement_id: int, workout_id: int, intensity: int, notes: str) -> Optional[Exercise]:
    created_record = None
    if MovementDomain.is_valid_id(movement_id) and WorkoutDomain.is_valid_id(workout_id):
        movement = MovementDomain.get_by_id(movement_id)
        workout = WorkoutDomain.get_by_id(workout_id)

        if len(notes) > MAX_NOTE_LENGTH:
            notes = notes[:MAX_NOTE_LENGTH]

        created_record = Exercise.objects.create(movement=movement, workout=workout, intensity=intensity, notes=notes)
    return created_record
