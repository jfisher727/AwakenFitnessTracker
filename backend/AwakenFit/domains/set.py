from datetime import timedelta

from ..models import Set

from ..domains import ExerciseDomain
from ..domains import WorkoutDomain


class SetDomain(object):

    @staticmethod
    def get_by_id(id: int) -> Set:
        return Set.objects.get(pk=id)

    @staticmethod
    def get_by_id_set(id_set: list[int]) -> list[Set]:
        return Set.objects.filter(id__in=id_set).all()

    @staticmethod
    def get_by_exercise_id(id: int) -> list[Set]:
        return Set.objects.filter(exercise__id=id).all()

    @staticmethod
    def get_by_workout_id(id: int) -> list[Set]:
        return Set.objects.filter(workout__id=id).all()

    @staticmethod
    def create_set(
        exercise_id: int,
        workout_id: int,
        sequence_number: int,
        completed_reps: int,
        min_reps: int,
        max_reps: int,
        weight: int,
        duration: timedelta,
        set_type: str,
        parent_set: Set,
    ) -> Set:
        exercise = ExerciseDomain.get_by_id(exercise_id)
        workout = WorkoutDomain.get_by_id(workout_id)
        return Set.objects.create(
            exercise,
            workout,
            sequence_number,
            completed_reps,
            min_reps,
            max_reps,
            weight,
            duration,
            set_type,
            parent_set,
        )
