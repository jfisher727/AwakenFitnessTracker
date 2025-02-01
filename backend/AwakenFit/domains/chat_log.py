from django.db.models import QuerySet
from django.contrib.auth.models import User

from ..models import ChatLog

from . import UserDomain


class ChatLogDomain(object):

    @staticmethod
    def get_by_id(id: int) -> ChatLog:
        return ChatLog.objects.get(pk=id)

    @staticmethod
    def get_by_id_set(id_set: list[id]) -> list[ChatLog]:
        return ChatLog.objects.filter(id__in=id_set).all()

    @staticmethod
    def get_by_user_id(id: int) -> list[ChatLog] | None:
        if UserDomain.is_valid_id(id):
            return ChatLog.objects.filter(user__id=id).all()
        return None

    @staticmethod
    def get_by_user_id_filter_and_limit(user_id: int, limit: int) -> list[ChatLog] | None:
        queryset = None
        if UserDomain.is_valid_id(user_id):
            queryset = ChatLog.objects.filter(user__id=user_id, include_in_future=True).order_by("-last_modified")[
                :limit
            ]
        return queryset

    @staticmethod
    def is_valid_id(id: int) -> bool:
        return ChatLog.objects.filter(id=id).exists()

    @staticmethod
    def filter_queryset_by_user(queryset: QuerySet, user: User) -> QuerySet:
        return queryset.filter(user=user)

    @staticmethod
    def create_ai_chat_log(user: User, role_type: str, message: str, include_in_future: bool) -> ChatLog:
        return ChatLog.objects.create(
            user=user, role_type=role_type, message=message, include_in_future=include_in_future
        )
