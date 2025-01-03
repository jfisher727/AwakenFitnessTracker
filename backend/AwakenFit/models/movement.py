from django.db import models

from .base_object import BaseModel


class Movement(BaseModel):
    """
    This is the model to hold the details around a particular movement a
    person performs while exercising.
    """

    ABDOMINALS = "Abdominals"
    BACK = "Back"
    BICEPS = "Biceps"
    CALF = "Calf"
    CHEST = "Chest"
    FOREARM = "Forearm"
    GLUTES = "Glutes"
    HAMSTRING = "Hamstring"
    LATS = "Lats"
    QUADRICEPS = "Quadriceps"
    SHOULDERS = "Shoulders"
    TRAPEZIUS = "Trapezius"
    TRICEPS = "Triceps"
    MUSCLE_CHOICES = [
        (ABDOMINALS, ABDOMINALS),
        (BACK, BACK),
        (BICEPS, BICEPS),
        (CALF, CALF),
        (CHEST, CHEST),
        (FOREARM, FOREARM),
        (GLUTES, GLUTES),
        (HAMSTRING, HAMSTRING),
        (LATS, LATS),
        (QUADRICEPS, QUADRICEPS),
        (SHOULDERS, SHOULDERS),
        (TRAPEZIUS, TRAPEZIUS),
        (TRICEPS, TRICEPS),
    ]
    BARBELL = "Barbell"
    BODY_ONLY = "Body Only"
    CABLE = "Cable"
    DUMBBELL = "Dumbbell"
    EXERCISE_BALL = "Exercise Ball"
    EZ_CURL_BAR = "EZ-Curl Bar"
    KETTLEBELL = "Kettlebell"
    MACHINE = "Machine"
    MEDICINE_BALL = "Medicine Ball"
    NONE = "None"
    RESISTENCE_BANDS = "Resistence Bands"
    EQUIPMENT_CHOICES = [
        (BARBELL, BARBELL),
        (BODY_ONLY, BODY_ONLY),
        (CABLE, CABLE),
        (DUMBBELL, DUMBBELL),
        (EXERCISE_BALL, EXERCISE_BALL),
        (EZ_CURL_BAR, EZ_CURL_BAR),
        (KETTLEBELL, KETTLEBELL),
        (MACHINE, MACHINE),
        (MEDICINE_BALL, MEDICINE_BALL),
        (NONE, NONE),
        (RESISTENCE_BANDS, RESISTENCE_BANDS),
    ]
    CARDIO = "Cardio"
    PLYOMETRICS = "Plyometrics"
    STRENGTH = "Strength"
    STRETCHING = "Stretching"
    MOVEMENT_TYPE_CHOICES = [
        (CARDIO, CARDIO),
        (PLYOMETRICS, PLYOMETRICS),
        (STRENGTH, STRENGTH),
        (STRETCHING, STRETCHING),
    ]

    name = models.CharField(max_length=255)
    description = models.CharField(max_length=500)
    primary_muscle_group = models.CharField(max_length=30, choices=MUSCLE_CHOICES, default=ABDOMINALS)
    secondary_muscle_group = models.CharField(max_length=30, choices=MUSCLE_CHOICES, default=ABDOMINALS)
    equpment_type = models.CharField(max_length=30, choices=EQUIPMENT_CHOICES, default=NONE)
    movement_type = models.CharField(max_length=30, choices=MOVEMENT_TYPE_CHOICES, default=STRENGTH)

    def __str__(self):
        return ", ".join([self.name])
