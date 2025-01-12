from ..models import Exercise
from ..models import Set

from ..domains import ExerciseDomain


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
    def calculate_one_rep_max(input: Set) -> int:
        return int(((input.weight * input.completed_reps) / 30.48) + input.weight)

    @staticmethod
    def calculate_set_volume(input: Set) -> int:
        return input.completed_reps * input.weight

    @staticmethod
    def create_parent_non_standard_set(
        exercise_id: int,
        set_type: str,
    ) -> Set:
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
    ) -> Set:
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
    ) -> Set:
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
    ) -> Set:
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
