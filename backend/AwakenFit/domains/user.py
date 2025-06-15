from django.contrib.auth.models import User


ERROR_MESSAGES = {
    "UNAUTHENTICATED": "Must be logged in to perform that action.",
    "MISSING_PERMISSIONS": "Must be super user to perform this action.",
}


def is_valid_id(id: int) -> bool:
    return User.objects.filter(id=id).exists()


def get_by_id(id: int) -> User:
    return User.objects.get(pk=id)


def get_by_id_set(id_set: list[int]) -> list[User]:
    return User.objects.filter(id__in=id_set).all()
