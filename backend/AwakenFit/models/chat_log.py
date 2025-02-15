from django.db import models
from django.contrib.auth.models import User

from .base_object import BaseModel


class ChatLog(BaseModel):
    DEVELOPER = "developer"
    ASSISTANT = "assistant"
    USER = "user"
    ROLE_TYPE_CHOICES = [
        (DEVELOPER, DEVELOPER),
        (ASSISTANT, ASSISTANT),
        (USER, USER),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_log")
    role_type = models.CharField(max_length=20, choices=ROLE_TYPE_CHOICES, default=USER)
    message = models.JSONField()
    include_in_future = models.BooleanField(default=True)

    def __str__(self) -> str:
        return " ".join([str(self.user), self.role_type])
