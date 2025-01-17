from ..models import Exercise

from ..domains import UserDomain
from ..domains import MovementDomain
from ..domains import WorkoutDomain


class ExerciseDomain(object):
    MAX_NOTE_LENGTH = 495

    @staticmethod
    def get_by_id(id: int) -> Exercise:
        return Exercise.objects.get(pk=id)

    @staticmethod
    def get_by_id_set(id_set: list[id]) -> list[Exercise]:
        return Exercise.objects.filter(id__in=id_set).all()

    @staticmethod
    def get_by_user_id(id: int) -> list[Exercise]:
        if UserDomain.is_valid_id(id):
            return Exercise.objects.filter(workout__user__id=id).all()
        return None

    @staticmethod
    def is_valid_id(id: int) -> bool:
        return Exercise.objects.filter(id=id).exists()

    @staticmethod
    def create_exercise(movement_id: int, workout_id: int, intensity: int, notes: str) -> Exercise:
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
