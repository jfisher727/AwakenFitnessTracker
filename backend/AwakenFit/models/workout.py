from django.contrib.auth.models import User
from django.db import models

from .base_object import BaseModel


class Workout(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    stop_time = models.DateTimeField(auto_now_add=True)
    template = models.BooleanField(default=False)
    notes = models.CharField(max_length=500)

    def __str__(self):
        return ", ".join([self.user.username, self.start_time])
