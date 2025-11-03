from AwakenFit.models import WorkoutDay

from AwakenFit.domains import workout as WorkoutDomain
from AwakenFit.domains import workout_plan as WorkoutPlanDomain


def get_by_id(id: int) -> WorkoutDay:
    return WorkoutDay.objects.get(pk=id)


def get_by_id_set(id_set: list[int]) -> list[WorkoutDay]:
    return WorkoutDay.objects.filter(id__in=id_set).all()


def get_by_plan_id(id: int) -> list[WorkoutDay] | None:
    selected_records = None
    if WorkoutPlanDomain.is_valid_id(id):
        selected_records = WorkoutDay.objects.filter(plan__id=id).all()
    return selected_records


def get_first_day_of_plan(plan_id: int) -> WorkoutDay:
    selected_records = None
    if WorkoutPlanDomain.is_valid_id(plan_id):
        selected_records = WorkoutDay.objects.filter(plan__id=plan_id).order_by("sequence_number").first()
    return selected_records


def get_by_plan_sequence_number(plan_id: int, sequence_number: int) -> WorkoutDay | None:
    selected_records = None
    if WorkoutPlanDomain.is_valid_id(plan_id):
        selected_records = WorkoutDay.objects.filter(plan__id=plan_id, sequence_number=sequence_number).first()
    return selected_records


def get_by_plan_day_number(plan_id: int, day_number: int) -> WorkoutDay | None:
    selected_records = None
    if WorkoutPlanDomain.is_valid_id(plan_id):
        selected_records = WorkoutDay.objects.filter(plan__id=plan_id, day_number=day_number).first()
    return selected_records


def get_by_plan_sequence_number_day_number(plan_id: int, sequence_number: int, day_number: int) -> WorkoutDay | None:
    selected_records = None
    if WorkoutPlanDomain.is_valid_id(plan_id):
        selected_records = WorkoutDay.objects.filter(
            plan__id=plan_id, sequence_number=sequence_number, day_number=day_number
        ).first()
    return selected_records


def is_valid_id(id: int) -> bool:
    return WorkoutDay.objects.filter(id=id).exists()


def is_sequence_number_day_number_available(plan_id: int, sequence_number: int, day_number: int) -> bool:
    return not WorkoutDay.objects.filter(
        plan__id=plan_id, sequence_number=sequence_number, day_number=day_number
    ).exists()


def create_update_workout_day(
    plan_id: int,
    sequence_number: int,
    day_number: int,
    workout_one_id: int | None = None,
    workout_two_id: int | None = None,
    workout_three_id: int | None = None,
    rest_day: bool = False,
) -> WorkoutDay:
    created_record = None
    if WorkoutPlanDomain.is_valid_id(plan_id):
        plan = WorkoutPlanDomain.get_by_id(plan_id)
        if is_sequence_number_day_number_available(plan_id, sequence_number, day_number):
            created_record = WorkoutDay.objects.create(
                plan=plan, sequence_number=sequence_number, day_number=day_number, rest_day=rest_day
            )
        else:
            created_record = get_by_plan_sequence_number_day_number(plan_id, sequence_number, day_number)

        if WorkoutDomain.is_valid_id(workout_one_id):
            created_record.workout_one = WorkoutDomain.get_by_id(workout_one_id)
        if workout_two_id and WorkoutDomain.is_valid_id(workout_two_id):
            created_record.workout_two = WorkoutDomain.get_by_id(workout_two_id)
        if workout_three_id and WorkoutDomain.is_valid_id(workout_three_id):
            created_record.workout_three = WorkoutDomain.get_by_id(workout_three_id)

        created_record.save()

    return created_record
