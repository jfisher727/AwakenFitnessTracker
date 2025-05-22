from datetime import date

from AwakenFit.models import ActiveWorkoutPlan

from AwakenFit.domains import user as UserDomain
from AwakenFit.domains import workout_plan as WorkoutPlanDomain
from AwakenFit.domains import workout_day as WorkoutDayDomain


def get_by_id(id: int) -> ActiveWorkoutPlan:
    return ActiveWorkoutPlan.objects.get(pk=id)


def get_by_id_set(id_set: list[int]) -> list[ActiveWorkoutPlan]:
    return ActiveWorkoutPlan.objects.filter(id__in=id_set).all()


def get_by_user_id(user_id: int) -> list[ActiveWorkoutPlan] | None:
    selected_records = None
    if UserDomain.is_valid_id(user_id):
        selected_records = ActiveWorkoutPlan.objects.filter(user__id=user_id).first()
    return selected_records


def is_valid_id(id: int) -> bool:
    return ActiveWorkoutPlan.objects.filter(id=id).exists()


def start_new_workout_plan(user_id: int, plan_id: int) -> ActiveWorkoutPlan:
    created_record = None
    if UserDomain.is_valid_id(user_id) and WorkoutPlanDomain.is_valid_id(plan_id):
        selected_plan = WorkoutPlanDomain.get_by_id(plan_id)

        # the plan should be owned by the user
        if selected_plan.user.id != user_id:
            return created_record

        first_day_of_plan = WorkoutDayDomain.get_first_day_of_plan(plan_id)
        created_record = get_by_user_id(user_id)
        if created_record is not None:
            created_record.plan = selected_plan
            created_record.day = first_day_of_plan
            created_record.start_date = date.today()
            created_record.save()
        else:
            user = UserDomain.get_by_id(user_id)
            created_record = ActiveWorkoutPlan.objects.create(user=user, plan=selected_plan, day=first_day_of_plan)

    return created_record
