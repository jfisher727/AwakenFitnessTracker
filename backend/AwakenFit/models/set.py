import json

from django.db import models

from .base_object import BaseModel

from ..models import Exercise


class Set(BaseModel):
    DROP = "Drop Set"
    REST_PAUSE = "Rest Pause Set"
    STANDARD = "Standard Set"
    SUPER_SET = "Super Set"
    SET_TYPE_CHOICES = [
        (DROP, DROP),
        (REST_PAUSE, REST_PAUSE),
        (STANDARD, STANDARD),
        (SUPER_SET, SUPER_SET),
    ]
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="sets", null=True)
    sequence_number = models.IntegerField(default=1)
    completed_reps = models.IntegerField(default=0)
    min_reps = models.IntegerField(default=0)
    max_reps = models.IntegerField(default=0)
    weight = models.IntegerField(default=0)
    duration = models.CharField(max_length=20, blank=True)
    set_type = models.CharField(max_length=30, choices=SET_TYPE_CHOICES, default=STANDARD)
    parent_set = models.ForeignKey("Set", on_delete=models.CASCADE, null=True, blank=True, related_name="child_sets")

    def __str__(self) -> str:
        return ", ".join([str(self.exercise), self.set_type])

    def to_json(self, json_dump: bool = False) -> str:
        set_details = dict()
        if self.set_type == Set.STANDARD:
            if self.completed_reps > 0:
                set_details["reps"] = self.completed_reps
            if self.weight > 0:
                set_details["weight"] = self.weight
            if len(self.duration) > 0:
                set_details["duration"] = self.duration

            # if we're returning to a parent set,
            # we don't want to encode our data
            if self.parent_set:
                set_details["exercise"] = self.exercise.movement.name
                return set_details
        else:
            set_details["setType"] = self.set_type
            child_sets = list()
            for entry in self.child_sets.all():
                child_sets.append(entry.to_json())
            set_details["sets"] = child_sets
        if json_dump:
            set_details = json.dumps(set_details)
        return set_details
