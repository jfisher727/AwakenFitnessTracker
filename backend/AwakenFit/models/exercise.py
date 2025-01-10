from django.db import models

from .base_object import BaseModel

from ..models import Movement


class Exercise(BaseModel):
    intensity = models.IntegerField(default=0)
    notes = models.CharField(max_length=500)
    movement = models.ForeignKey(Movement, on_delete=models.CASCADE)

    def __str__(self):
        return ", ".join([self.movement, self.intensity])
