from django.db import models
from django.contrib.auth.models import User

from .base_object import BaseModel


class WorkoutPlan(BaseModel):
    ONGOING = "Ongoing"  # this is for plans that cycle back to day 1 after finishing all the days
    DEFINITE = "Definite"  # this is for plans that stop after completing all the days
    PLAN_TYPE_OPTIONS = [(DEFINITE, DEFINITE), (ONGOING, ONGOING)]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workout_plans")
    name = models.CharField(max_length=255, blank=False)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPE_OPTIONS, default=ONGOING)
    block_size = models.IntegerField(default=7)

    def __str__(self):
        return " ".join([str(self.user), self.name, "Plan Type:", self.plan_type])
