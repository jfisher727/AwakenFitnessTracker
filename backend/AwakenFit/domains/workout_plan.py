from django.db.models import QuerySet
from django.contrib.auth.models import User

from AwakenFit.models import WorkoutPlan

from AwakenFit.domains import user as UserDomain

MAX_NAME_LENGTH = 255


def get_by_id(id: int) -> WorkoutPlan:
    return WorkoutPlan.objects.get(pk=id)


def get_by_id_set(id_set: list[int]) -> list[WorkoutPlan]:
    return WorkoutPlan.objects.filter(id__in=id_set).all()


def get_by_user_id(id: int) -> list[WorkoutPlan] | None:
    selected_records = None
    if UserDomain.is_valid_id(id):
        selected_records = WorkoutPlan.objects.filter(user__id=id).all()
    return selected_records


def is_valid_id(id: int) -> bool:
    return WorkoutPlan.objects.filter(id=id).exists()


def is_name_available(user_id: int, name: str) -> bool:
    return not WorkoutPlan.objects.filter(user__id=user_id, name=name).exists()


def filter_queryset_by_user(queryset: QuerySet, user: User) -> QuerySet:
    return queryset.filter(user=user)


def create_workout_plan(user_id: int, name: str, plan_type: str, block_size: int) -> WorkoutPlan | None:
    created_record = None
    if UserDomain.is_valid_id(user_id):
        user = UserDomain.get_by_id(user_id)
        if len(name) > MAX_NAME_LENGTH:
            name = name[:MAX_NAME_LENGTH]
        if is_name_available(user_id, name):
            created_record = WorkoutPlan.objects.create(
                user=user, name=name, plan_type=plan_type, block_size=block_size
            )

    return created_record
