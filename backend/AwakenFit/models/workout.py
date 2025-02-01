import json

from django.contrib.auth.models import User
from django.db import models

from .base_object import BaseModel


class Workout(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workouts")
    start_time = models.DateTimeField(auto_now_add=True)
    stop_time = models.DateTimeField(auto_now_add=True)
    template = models.BooleanField(default=False)
    notes = models.CharField(max_length=500)

    def __str__(self) -> str:
        return ", ".join([self.user.username, str(self.start_time)])

    def to_json(self) -> str:
        exercises = [entry.to_json() for entry in self.exercises]
        return json.dumps(
            {"workoutDuration": self.stop_time - self.start_time, "notes": self.notes, "exercises": exercises}
        )
