from django.db import models

from .base_object import BaseModel

from AwakenFit.models import Workout
from AwakenFit.models import WorkoutPlan


class WorkoutDay(BaseModel):
    plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name="days")
    workout_one = models.ForeignKey(Workout, on_delete=models.CASCADE, null=True, related_name="first_workout")
    workout_two = models.ForeignKey(Workout, on_delete=models.CASCADE, null=True, related_name="second_workout")
    workout_three = models.ForeignKey(Workout, on_delete=models.CASCADE, null=True, related_name="third_workout")
    sequence_number = models.IntegerField(default=1)
    day_number = models.IntegerField(default=1)
    rest_day = models.BooleanField(default=True)

    def __str__(self) -> str:
        return " ".join([str(self.plan), "Day", str(self.day_number), "Rest Day:", str(self.rest_day)])
