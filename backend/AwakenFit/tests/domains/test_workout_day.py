from django.contrib.auth.models import User
from django.test import TestCase

from AwakenFit.models import Workout, WorkoutPlan, WorkoutDay

from AwakenFit.domains import workout_day as WorkoutDayDomain


class WorkoutPlanDomainTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user("testusername", "testemail@email.com", "testpassword1")

        self.test_workout_plan = WorkoutPlan.objects.create(user=self.test_user, name="Test Plan 1")
        self.test_day1 = WorkoutDay.objects.create(plan=self.test_workout_plan, sequence_number=1, day_number=1)
        self.test_day2 = WorkoutDay.objects.create(plan=self.test_workout_plan, sequence_number=2, day_number=2)
        self.test_day3 = WorkoutDay.objects.create(plan=self.test_workout_plan, sequence_number=3, day_number=7)

        self.test_workout1 = Workout.objects.create(user=self.test_user, template=True, notes="Test Workout 1")
        self.test_workout2 = Workout.objects.create(user=self.test_user, template=True, notes="Test Workout 2")
        self.test_workout3 = Workout.objects.create(user=self.test_user, template=True, notes="Test Workout 3")

    def test_get_by_id(self):
        self.assertEqual(
            self.test_day1,
            WorkoutDayDomain.get_by_id(self.test_day1.id),
            "Failed to get the expected record back",
        )

    def test_get_by_id_set(self):
        id_set = set([self.test_day1.id, self.test_day2.id])
        result = WorkoutDayDomain.get_by_id_set(id_set)
        self.assertEqual(2, len(result), "Did not get the appropriate number of records back")
        test_days = [self.test_day1, self.test_day2]
        for entry in result:
            self.assertTrue(entry in test_days, "Query returned an unexpected record")

    def test_get_by_plan_id(self):
        result = WorkoutDayDomain.get_by_plan_id(self.test_workout_plan.id)
        self.assertEqual(3, len(result), "Did not get the appropriate number of records back")
        for entry in result:
            self.assertEqual(
                self.test_workout_plan, entry.plan, "The Workout Day is not associated with the expected plan"
            )

    def test_get_by_plan_sequence_number(self):
        self.assertEqual(
            self.test_day1,
            WorkoutDayDomain.get_by_plan_sequence_number(self.test_workout_plan.id, 1),
            "Did not get the expected record",
        )
        self.assertEqual(
            self.test_day3,
            WorkoutDayDomain.get_by_plan_sequence_number(self.test_workout_plan.id, 3),
            "Did not get the expected record",
        )

    def test_get_by_plan_day_number(self):
        self.assertEqual(
            self.test_day1,
            WorkoutDayDomain.get_by_plan_day_number(self.test_workout_plan.id, 1),
            "Did not get the expected record",
        )
        self.assertEqual(
            self.test_day3,
            WorkoutDayDomain.get_by_plan_day_number(self.test_workout_plan.id, 7),
            "Did not get the expected record",
        )

    def test_get_by_plan_sequence_number_day_number(self):
        self.assertEqual(
            self.test_day1,
            WorkoutDayDomain.get_by_plan_sequence_number_day_number(self.test_workout_plan.id, 1, 1),
            "Did not get the expected record",
        )
        self.assertEqual(
            self.test_day3,
            WorkoutDayDomain.get_by_plan_sequence_number_day_number(self.test_workout_plan.id, 3, 7),
            "Did not get the expected record",
        )

    def test_is_valid_id(self):
        self.assertTrue(WorkoutDayDomain.is_valid_id(self.test_day1.id), "WorkoutDay ID should be valid")
        self.assertFalse(WorkoutDayDomain.is_valid_id(123), "WorkoutDay ID should not be valid")

    def test_is_sequence_number_day_number_available(self):
        self.assertFalse(WorkoutDayDomain.is_sequence_number_day_number_available(self.test_workout_plan.id, 1, 1))
        self.assertTrue(WorkoutDayDomain.is_sequence_number_day_number_available(self.test_workout_plan.id, 4, 10))

    def test_create_update_workout_day(self):
        existing_workout_days = WorkoutDay.objects.all().count()

        result = WorkoutDayDomain.create_update_workout_day(self.test_workout_plan.id, 4, 10, self.test_workout1.id)
        self.assertIsNotNone(result, "A WorkoutDay should have been created")
        self.assertEqual(
            existing_workout_days + 1, WorkoutDay.objects.all().count(), "The Workout Day count should have increased"
        )

        existing_workout_days = WorkoutDay.objects.all().count()
        result = WorkoutDayDomain.create_update_workout_day(
            self.test_workout_plan.id,
            1,
            1,
            workout_one_id=self.test_workout1.id,
            workout_two_id=self.test_workout2.id,
            workout_three_id=self.test_workout3.id,
        )
        self.assertIsNotNone(result, "A WorkoutDay should have been created")
        self.assertEqual(self.test_day1.id, result.id, "Should have updated an existing record")
        self.assertEqual(
            existing_workout_days, WorkoutDay.objects.all().count(), "The Workout Day count should have stayed the same"
        )
