import json
from datetime import timedelta

from django.utils import timezone

from django.contrib.auth.models import User
from django.test import TestCase

from ...models import Movement
from ...models import Exercise
from ...models import Workout
from ...models import Set


class WorkoutModelTest(TestCase):

    def setUp(self):
        self.test_user = User.objects.create_user("testusername", "testemail@email.com", "testpassword1")
        self.test_movement = Movement.objects.create(
            name="BB Squats",
            description="This is a test movement",
            primary_muscle_group=Movement.QUADRICEPS,
            secondary_muscle_group=Movement.ABDOMINALS,
            equipment_type=Movement.BARBELL,
            movement_type=Movement.STRENGTH,
        )
        self.test_movement2 = Movement.objects.create(
            name="BB Bench",
            description="This is a test movement",
            primary_muscle_group=Movement.CHEST,
            equipment_type=Movement.BARBELL,
            movement_type=Movement.STRENGTH,
        )
        start_time = timezone.now()
        stop_time = start_time + timedelta(minutes=30)
        self.test_workout = Workout.objects.create(
            user=self.test_user, start_time=start_time, stop_time=stop_time, template=False, notes="Test Workout"
        )

        self.test_exercise = Exercise.objects.create(
            movement=self.test_movement, workout=self.test_workout, intensity=1, notes="Test Exercise notes"
        )
        self.test_exercise2 = Exercise.objects.create(
            movement=self.test_movement2, workout=self.test_workout, intensity=1, notes="Test Exercise notes"
        )
        self.test_exercise3 = Exercise.objects.create(
            movement=self.test_movement, workout=self.test_workout, intensity=1, notes="Test Exercise notes"
        )
        self.test_exercise4 = Exercise.objects.create(
            movement=self.test_movement2, workout=self.test_workout, intensity=1, notes="Test Exercise notes"
        )

        self.COMPLETED_REPS_1 = 10
        self.WEIGHT_1 = 135
        self.test_set = Set.objects.create(
            exercise=self.test_exercise,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
        )
        self.COMPLETED_DURATION = "00H01M00S"
        self.test_set2 = Set.objects.create(
            exercise=self.test_exercise,
            duration=self.COMPLETED_DURATION,
            weight=self.WEIGHT_1,
        )
        self.test_set3 = Set.objects.create(
            exercise=self.test_exercise,
            duration=self.COMPLETED_DURATION,
        )

        self.parent_set = Set.objects.create(set_type=Set.SUPER_SET)
        self.child_set1 = Set.objects.create(
            exercise=self.test_exercise3,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
            parent_set=self.parent_set,
        )
        self.child_set2 = Set.objects.create(
            exercise=self.test_exercise4,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
            parent_set=self.parent_set,
        )

    def test_to_json(self):
        result = json.loads(self.test_workout.to_json())
        self.assertEqual(result["workoutDuration"], "00H30M00S")
        self.assertEqual(result["notes"], "Test Workout")
        self.assertEqual(len(result["exercises"]), 4)
