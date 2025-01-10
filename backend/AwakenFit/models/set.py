from django.db import models

from .base_object import BaseModel

from ..models import Exercise
from ..models import Workout


class Set(BaseModel):
    DROP = "Drop Set"
    REST_PAUSE = "Rest Pause Set"
    STANDARD = "Standard Set"
    SET_TYPE_CHOICES = [
        (DROP, DROP),
        (REST_PAUSE, REST_PAUSE),
        (STANDARD, STANDARD),
    ]
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    sequence_number = models.IntegerField(default=1)
    completed_reps = models.IntegerField(default=0)
    min_reps = models.IntegerField(default=0)
    max_reps = models.IntegerField(default=0)
    weight = models.IntegerField(default=0)
    set_type = models.CharField(max_length=30, choices=SET_TYPE_CHOICES, default=STANDARD)
    parent_set = models.ForeignKey("Set", on_delete=models.CASCADE)

    def __str__(self):
        return ", ".join([self.workout, self.exercise, self.set_type])
