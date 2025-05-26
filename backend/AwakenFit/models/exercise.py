import json

from django.db import models

from AwakenFit.models.base_object import BaseModel

from AwakenFit.models import Movement, Workout


class Exercise(BaseModel):
    intensity = models.IntegerField(default=0)
    notes = models.CharField(max_length=500, blank=True)
    movement = models.ForeignKey(Movement, on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name="exercises")

    def __str__(self) -> str:
        return ", ".join([str(self.movement), str(self.intensity)])

    def to_json(self, json_dump: bool = False) -> str:
        sets = [entry.to_json() for entry in self.sets.all()]
        exercise_details = {"exercise": self.movement.name, "notes": self.notes, "sets": sets}
        if json_dump:
            exercise_details = json.dumps(exercise_details)
        return exercise_details
