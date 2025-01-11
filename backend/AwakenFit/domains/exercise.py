from ..models import Exercise

from ..domains import MovementDomain


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
        pass

    @staticmethod
    def is_valid_id(id: int) -> bool:
        return Exercise.objects.filter(id=id).exists()

    @staticmethod
    def create_exercise(movement_id: int, intensity: int, notes: str) -> Exercise:
        movement = MovementDomain.get_by_id(movement_id)

        if len(notes) > ExerciseDomain.MAX_NOTE_LENGTH:
            notes = notes[: ExerciseDomain.MAX_NOTE_LENGTH]

        return Exercise.objects.create(movement=movement, intensity=intensity, notes=notes)
