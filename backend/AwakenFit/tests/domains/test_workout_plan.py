from django.contrib.auth.models import User
from django.test import TestCase

from AwakenFit.models import WorkoutPlan

from AwakenFit.domains import workout_plan as WorkoutPlanDomain


class WorkoutPlanDomainTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user("testusername", "testemail@email.com", "testpassword1")
        self.test_user2 = User.objects.create_user("testusername2", "testemail2@email.com", "testpassword2")

        self.test_workout1 = WorkoutPlan.objects.create(user=self.test_user, name="Test Plan 1")
        self.test_workout2 = WorkoutPlan.objects.create(user=self.test_user, name="Test Plan 2")

        self.test_workout3 = WorkoutPlan.objects.create(user=self.test_user2, name="Test Plan 1")

    def test_get_by_id(self):
        self.assertEqual(
            self.test_workout1,
            WorkoutPlanDomain.get_by_id(self.test_workout1.id),
            "Failed to get the expected record back",
        )
        self.assertEqual(
            self.test_workout3,
            WorkoutPlanDomain.get_by_id(self.test_workout3.id),
            "Failed to get the expected record back",
        )

    def test_get_by_id_set(self):
        id_set = set([self.test_workout1.id, self.test_workout2.id])
        result = WorkoutPlanDomain.get_by_id_set(id_set)
        self.assertEqual(2, len(result), "Did not get the appropriate number of records back")
        test_workouts = [self.test_workout1, self.test_workout2]
        for entry in result:
            self.assertTrue(entry in test_workouts, "Query returned an unexpected record")

    def test_get_by_user_id(self):
        self.assertEqual(
            2, len(WorkoutPlanDomain.get_by_user_id(self.test_user.id)), "Did not get the expected number of records"
        )
        self.assertEqual(
            1, len(WorkoutPlanDomain.get_by_user_id(self.test_user2.id)), "Did not get the expected number of records"
        )

    def test_is_valid_id(self):
        self.assertTrue(WorkoutPlanDomain.is_valid_id(self.test_workout1.id), "Workout Plan ID should have been valid")
        self.assertFalse(WorkoutPlanDomain.is_valid_id(123), "Workout Plan ID should not have been valid")

    def test_is_name_available(self):
        self.assertTrue(
            WorkoutPlanDomain.is_name_available(self.test_user.id, "A new plan"),
            "The plan name should be available for this user",
        )
        self.assertFalse(
            WorkoutPlanDomain.is_name_available(self.test_user.id, "Test Plan 2"),
            "The plan name should not be available for this user",
        )
        self.assertTrue(
            WorkoutPlanDomain.is_name_available(self.test_user2.id, "Test Plan 2"),
            "The plan name should be available for this user",
        )

    def test_filter_querset_by_user(self):
        queryset = WorkoutPlan.objects.all()

        results = WorkoutPlanDomain.filter_queryset_by_user(queryset, self.test_user)
        expected_results = [self.test_workout1, self.test_workout2]
        self.assertEqual(len(expected_results), len(results), "Did not get the expected number of records back")
        for entry in results:
            self.assertTrue(entry in expected_results, "Received an un-expected record")

        results2 = WorkoutPlanDomain.filter_queryset_by_user(queryset, self.test_user2)
        expected_results = [self.test_workout3]
        self.assertEqual(len(expected_results), len(results2), "Did not get the expected number of records back")
        for entry in results2:
            self.assertTrue(entry in expected_results, "Received an un-expected record")

    def test_create_workout_plan(self):
        self.assertEqual(
            2, len(WorkoutPlanDomain.get_by_user_id(self.test_user.id)), "The user should have two workout plans"
        )

        result = WorkoutPlanDomain.create_workout_plan(self.test_user.id, "A new workout plan", "Ongoing", 7)
        self.assertIsNotNone(result, "A created record should have been returned")
        self.assertEqual(
            3,
            len(WorkoutPlanDomain.get_by_user_id(self.test_user.id)),
            "The user should have an additional workout plan",
        )

        all_workout_plan_count = WorkoutPlan.objects.all().count()
        result = WorkoutPlanDomain.create_workout_plan(1234, "A new workout plan", "Ongoing", 7)
        self.assertIsNone(result, "No record should have been created")
        self.assertEqual(
            all_workout_plan_count, WorkoutPlan.objects.all().count(), "The plan count should be un-changed"
        )

        all_workout_plan_count = WorkoutPlan.objects.all().count()
        result = WorkoutPlanDomain.create_workout_plan(self.test_user.id, "Test Plan 1", "Ongoing", 7)
        self.assertIsNone(result, "No record should have been created")
        self.assertEqual(
            all_workout_plan_count, WorkoutPlan.objects.all().count(), "The plan count should be un-changed"
        )
