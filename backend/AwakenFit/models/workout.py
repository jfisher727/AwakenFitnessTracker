import json

from django.utils import timezone
from django.contrib.auth.models import User
from django.db import models

from .base_object import BaseModel


def current_datetime():
    return timezone.now()


class Workout(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workouts")
    start_time = models.DateTimeField(default=current_datetime)
    stop_time = models.DateTimeField(default=current_datetime)
    template = models.BooleanField(default=False)
    name = models.CharField(max_length=255, blank=True)
    notes = models.CharField(max_length=500, blank=True)

    def __str__(self) -> str:
        repr = list()
        repr.append(self.user.username)
        if self.name:
            repr.append(self.name)
        repr.append(str(self.start_time))
        return ", ".join(repr)

    def to_json(self) -> str:
        exercises = [entry.to_json() for entry in self.exercises.all()]
        duration = self.stop_time - self.start_time
        return json.dumps(
            {
                "workoutDuration": f"{duration.seconds // 3600:02d}H{(duration.seconds // 60) % 60:02d}M{duration.seconds % 60:02d}S",
                "notes": self.notes,
                "exercises": exercises,
            }
        )
