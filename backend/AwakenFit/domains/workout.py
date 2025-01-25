from typing import Optional
from datetime import datetime

from django.db.models import QuerySet
from django.contrib.auth.models import User

from ..models import Workout

from ..domains import UserDomain


class WorkoutDomain(object):
    MAX_NOTES_LENGTH = 495

    @staticmethod
    def get_by_id(id: int) -> Workout:
        return Workout.objects.get(pk=id)

    @staticmethod
    def get_by_id_set(id_set: list[int]) -> list[Workout]:
        return Workout.objects.filter(id__in=id_set).all()

    @staticmethod
    def is_valid_id(id: int) -> bool:
        return Workout.objects.filter(id=id).exists()

    @staticmethod
    def is_valid_template(id: int) -> bool:
        return Workout.objects.filter(id=id, template=True).exists()

    @staticmethod
    def get_by_user_id(id: int) -> list[Workout]:
        selected_records = None
        if UserDomain.is_valid_id(id):
            selected_records = Workout.objects.filter(user__id=id).all()
        return selected_records

    @staticmethod
    def filter_queryset_by_user(queryset: QuerySet, user: User) -> QuerySet:
        return queryset.filter(user=user)

    @staticmethod
    def create_workout(
        user_id: int, start_time: datetime, stop_time: datetime, template: bool, notes: str
    ) -> Optional[Workout]:
        created_record = None
        if UserDomain.is_valid_id(user_id):
            user = UserDomain.get_by_id(user_id)
            if len(notes) > WorkoutDomain.MAX_NOTES_LENGTH:
                notes = notes[: WorkoutDomain.MAX_NOTES_LENGTH]
            created_record = Workout.objects.create(
                user=user, start_time=start_time, stop_time=stop_time, template=template, notes=notes
            )
        return created_record
