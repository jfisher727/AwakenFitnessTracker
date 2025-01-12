from datetime import datetime

from django.contrib.auth.models import User
from django.test import TestCase

from ...models import Workout

from ...domains import WorkoutDomain


class WorkoutDomainTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user("testusername", "testemail@email.com", "testpassword1")
        self.test_user2 = User.objects.create_user("testusername2", "testemail2@email.com", "testpassword2")
        self.test_workout = Workout.objects.create(user=self.test_user, template=True, notes="Test Template")
        self.test_workout2 = Workout.objects.create(user=self.test_user, template=False, notes="Test Workout")

    def test_get_by_id(self):
        self.assertEqual(
            self.test_workout,
            WorkoutDomain.get_by_id(self.test_workout.id),
            "Failed to get the expected record back",
        )
        self.assertEqual(
            self.test_workout2,
            WorkoutDomain.get_by_id(self.test_workout2.id),
            "Failed to get the expected record back",
        )

    def test_get_by_id_set(self):
        id_set = set([self.test_workout.id, self.test_workout2.id])
        result = WorkoutDomain.get_by_id_set(id_set)
        self.assertEqual(2, len(result), "Did not get the appropriate number of records back")
        test_exercises = [self.test_workout, self.test_workout2]
        for entry in result:
            self.assertTrue(entry in test_exercises, "Query returned an unexpected record")

    def test_is_valid_id(self):
        self.assertTrue(WorkoutDomain.is_valid_id(self.test_workout.id), "Workout ID should have been valid")
        self.assertFalse(WorkoutDomain.is_valid_id(12345), "Workout ID should not have been valid")

    def test_is_valid_template(self):
        self.assertTrue(WorkoutDomain.is_valid_template(self.test_workout.id), "Workout ID should have been valid")
        self.assertFalse(
            WorkoutDomain.is_valid_template(self.test_workout2.id), "Workout ID should not have been valid"
        )

    def test_get_by_user_id(self):
        self.assertEqual(
            2, len(WorkoutDomain.get_by_user_id(self.test_user.id)), "Did not get the expected number of records"
        )
        self.assertEqual(
            0, len(WorkoutDomain.get_by_user_id(self.test_user2.id)), "Did not get the expected number of records"
        )

    def test_create_workout(self):
        existing_workouts = len(Workout.objects.all())

        result = WorkoutDomain.create_workout(
            self.test_user.id, datetime.now(), datetime.now(), False, "These are test workout notes"
        )

        updated_workouts = len(Workout.objects.all())

        self.assertIsNotNone(result, "Should have resulted in a new Workout being returned")
        self.assertNotEqual(existing_workouts, updated_workouts, "New workout should have been created")
        self.assertEqual(existing_workouts + 1, updated_workouts)

    def test_create_workout_bad_input(self):
        pass
