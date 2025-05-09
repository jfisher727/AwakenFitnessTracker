from datetime import datetime

from django.db.models import QuerySet
from django.contrib.auth.models import User

from AwakenFit.models import Workout

from AwakenFit.domains import user as UserDomain


MAX_NOTES_LENGTH = 495


def get_by_id(id: int) -> Workout:
    return Workout.objects.get(pk=id)


def get_by_id_set(id_set: list[int]) -> list[Workout]:
    return Workout.objects.filter(id__in=id_set).all()


def is_valid_id(id: int) -> bool:
    return Workout.objects.filter(id=id).exists()


def is_valid_template(id: int) -> bool:
    return Workout.objects.filter(id=id, template=True).exists()


def get_by_user_id(id: int) -> list[Workout] | None:
    selected_records = None
    if UserDomain.is_valid_id(id):
        selected_records = Workout.objects.filter(user__id=id).prefetch_related("exercises").all()
    return selected_records


def get_by_user_date_range(id: int, start_date: datetime, end_date: datetime) -> list[Workout] | None:
    selected_records = None
    if UserDomain.is_valid_id(id):
        selected_records = (
            Workout.objects.filter(user__id=id, template=False, start_time__gte=start_date, start_time__lte=end_date)
            .prefetch_related("exercises", "exercises__movement", "exercises__sets")
            .all()
        )
    return selected_records


def filter_queryset_by_user(queryset: QuerySet, user: User) -> QuerySet:
    return queryset.filter(user=user).order_by("name")


def create_workout(
    user_id: int, start_time: datetime, stop_time: datetime, template: bool, notes: str
) -> Workout | None:
    created_record = None
    if UserDomain.is_valid_id(user_id):
        user = UserDomain.get_by_id(user_id)
        if notes is None:
            notes = ""
        if len(notes) > MAX_NOTES_LENGTH:
            notes = notes[:MAX_NOTES_LENGTH]
        created_record = Workout.objects.create(
            user=user, start_time=start_time, stop_time=stop_time, template=template, notes=notes
        )
    return created_record
