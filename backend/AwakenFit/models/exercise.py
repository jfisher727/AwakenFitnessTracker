from django.db import models

from .base_object import BaseModel

from ..models import Movement
from ..models import Workout


class Exercise(BaseModel):
    intensity = models.IntegerField(default=0)
    notes = models.CharField(max_length=500)
    movement = models.ForeignKey(Movement, on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name="exercises")

    def __str__(self):
        return ", ".join([str(self.movement), str(self.intensity)])
