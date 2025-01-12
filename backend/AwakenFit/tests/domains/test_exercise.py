from django.contrib.auth.models import User
from django.test import TestCase

from ...models import Exercise
from ...models import Movement
from ...models import Workout
from ...models import Set

from ...domains import MovementDomain
from ...domains import ExerciseDomain


class ExerciseDomainTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user("testusername", "testemail@email.com", "testpassword1")
        self.test_movement = MovementDomain.create_movement(
            "Test Movement",
            "This is a test movement",
            Movement.CHEST,
            Movement.NONE,
            Movement.BARBELL,
            Movement.STRENGTH,
        )

        self.test_workout = Workout.objects.create(user=self.test_user, template=False, notes="Test Workout")

        self.test_exercise = Exercise.objects.create(
            movement=self.test_movement, workout=self.test_workout, intensity=1, notes="Test Exercise notes"
        )
        self.test_exercise2 = Exercise.objects.create(
            movement=self.test_movement, workout=self.test_workout, intensity=2, notes="Test Exercise 2 notes"
        )

        self.COMPLETED_REPS_1 = 10
        self.WEIGHT_1 = 135
        self.test_set = Set.objects.create(
            exercise=self.test_exercise,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
        )

    def test_get_by_id(self):
        self.assertEqual(
            self.test_exercise,
            ExerciseDomain.get_by_id(self.test_exercise.id),
            "Failed to get the expected record back",
        )
        self.assertEqual(
            self.test_exercise2,
            ExerciseDomain.get_by_id(self.test_exercise2.id),
            "Failed to get the expected record back",
        )

    def test_get_by_id_set(self):
        id_set = set([self.test_exercise.id, self.test_exercise2.id])
        result = ExerciseDomain.get_by_id_set(id_set)
        self.assertEqual(2, len(result), "Did not get the appropriate number of records back")
        test_exercises = [self.test_exercise, self.test_exercise2]
        for entry in result:
            self.assertTrue(entry in test_exercises, "Query returned an unexpected record")

    def test_get_by_user_id(self):
        result = ExerciseDomain.get_by_user_id(self.test_user.id)

        self.assertIsNotNone(result, "Should have returned a list of Exercises")
        self.assertEqual(2, len(result), "Did not receive the expected number of records")

    def test_create_exercise(self):
        existing_exercises = len(Exercise.objects.all())

        result = ExerciseDomain.create_exercise(self.test_movement.id, self.test_workout.id, 1, "Test Create Exercise")

        self.assertIsNotNone(result, "Should have resulted in an Exercise record being returned")

        updated_exercises = len(Exercise.objects.all())
        self.assertNotEqual(existing_exercises, updated_exercises, "New exercise should have been created")
        self.assertEqual(existing_exercises + 1, updated_exercises)

    def test_create_exercise_long_notes(self):
        existing_exercises = len(Exercise.objects.all())

        result = ExerciseDomain.create_exercise(
            self.test_movement.id, self.test_workout.id, 1, "A" * (ExerciseDomain.MAX_NOTE_LENGTH + 5)
        )

        self.assertIsNotNone(result, "Should have resulted in an Exercise record being returned")

        updated_exercises = len(Exercise.objects.all())
        self.assertNotEqual(existing_exercises, updated_exercises, "New exercise should have been created")
        self.assertEqual(existing_exercises + 1, updated_exercises)
        self.assertTrue(len(result.notes) <= ExerciseDomain.MAX_NOTE_LENGTH)
