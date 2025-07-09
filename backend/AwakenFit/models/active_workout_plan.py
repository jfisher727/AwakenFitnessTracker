from datetime import date

from django.db import models
from django.contrib.auth.models import User

from .base_object import BaseModel

from AwakenFit.models import WorkoutPlan
from AwakenFit.models import WorkoutDay


def today():
    return date.today()


class ActiveWorkoutPlan(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="active_plan")
    plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE)
    day = models.ForeignKey(WorkoutDay, on_delete=models.CASCADE)
    start_date = models.DateField(default=today)

    def __str__(self) -> str:
        return " ".join([str(self.user), str(self.day)])
