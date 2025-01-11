from datetime import datetime

from ..models import Workout

from ..domains import UserDomain


class WorkoutDomain(object):
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
    def create_workout(user_id: int, start_time: datetime, stop_time: datetime, template: bool, notes: str) -> Workout:
        user = UserDomain.get_by_id(user_id)
        return Workout.objects.create(user, start_time, stop_time, template, notes)
