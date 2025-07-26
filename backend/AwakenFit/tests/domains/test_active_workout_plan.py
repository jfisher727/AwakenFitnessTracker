from datetime import date

from django.contrib.auth.models import User
from django.test import TestCase

from AwakenFit.models import WorkoutPlan, WorkoutDay, ActiveWorkoutPlan

from AwakenFit.domains import active_workout_plan as ActiveWorkoutPlanDomain


class ActiveWorkoutDomainTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user("testusername", "testemail@email.com", "testpassword1")
        self.test_user2 = User.objects.create_user("testusername2", "testemail2@email.com", "testpassword2")
        self.test_user3 = User.objects.create_user("testusername3", "testemail3@email.com", "testpassword3")

        self.test_workout_plan = WorkoutPlan.objects.create(user=self.test_user, name="Test Plan 1")
        self.test_day1 = WorkoutDay.objects.create(plan=self.test_workout_plan, sequence_number=1, day_number=1)
        WorkoutDay.objects.create(plan=self.test_workout_plan, sequence_number=2, day_number=2)
        WorkoutDay.objects.create(plan=self.test_workout_plan, sequence_number=3, day_number=7)
        self.test_workout_plan2 = WorkoutPlan.objects.create(user=self.test_user, name="Test Plan 2")
        self.test_day4 = WorkoutDay.objects.create(plan=self.test_workout_plan2, sequence_number=1, day_number=1)

        self.test_workout_plan3 = WorkoutPlan.objects.create(user=self.test_user2, name="Test Plan 2")
        self.test_day5 = WorkoutDay.objects.create(plan=self.test_workout_plan3, sequence_number=1, day_number=1)

        self.test_workout_plan4 = WorkoutPlan.objects.create(user=self.test_user3, name="Test Plan 3")
        self.test_day6 = WorkoutDay.objects.create(plan=self.test_workout_plan4, sequence_number=1, day_number=1)

        self.test_active_plan = ActiveWorkoutPlan.objects.create(
            user=self.test_user, plan=self.test_workout_plan, day=self.test_day1
        )
        self.test_active_plan2 = ActiveWorkoutPlan.objects.create(
            user=self.test_user2, plan=self.test_workout_plan2, day=self.test_day5
        )

    def test_get_by_id(self):
        self.assertEqual(
            self.test_active_plan,
            ActiveWorkoutPlanDomain.get_by_id(self.test_active_plan.id),
            "Did not get the expected record back",
        )

    def test_get_by_id_set(self):
        id_set = set([self.test_active_plan.id, self.test_active_plan2.id])
        result = ActiveWorkoutPlanDomain.get_by_id_set(id_set)
        self.assertEqual(2, len(result), "Did not get the expected number of records back")
        records = [self.test_active_plan, self.test_active_plan2]
        for entry in result:
            self.assertTrue(entry in records, "Did not get an expected record in the query")

    def test_get_by_user_id(self):
        self.assertEqual(
            self.test_active_plan,
            ActiveWorkoutPlanDomain.get_by_user_id(self.test_user.id),
            "Did not get the expected record back",
        )

    def test_is_valid_id(self):
        self.assertTrue(ActiveWorkoutPlanDomain.is_valid_id(self.test_active_plan.id), "ID should be valid")
        self.assertFalse(ActiveWorkoutPlanDomain.is_valid_id(1234), "ID should not have been valid")

    def test_filter_queryset_by_user(self):
        queryset = ActiveWorkoutPlan.objects.all()
        result = ActiveWorkoutPlanDomain.filter_queryset_by_user(queryset, self.test_user)
        self.assertIsNotNone(result, "Should expect at least one record back")
        self.assertEqual(1, len(result), "Should only get one record back")
        self.assertEqual(self.test_active_plan, result[0], "Did not get the expected record back")

        result2 = ActiveWorkoutPlanDomain.filter_queryset_by_user(queryset, self.test_user3)
        self.assertIsNotNone(result2, "No records should have been returned")
        self.assertEqual(0, len(result2), "Empty queryset should have been returned")

    def test_start_new_workout_plan(self):
        existing_active_workout_plans = ActiveWorkoutPlan.objects.all().count()

        # update user1's active plan
        result = ActiveWorkoutPlanDomain.start_new_workout_plan(self.test_user.id, self.test_workout_plan2.id)
        self.assertIsNotNone(result, "Should have returned a non None value")
        self.assertEqual(result.id, self.test_active_plan.id, "Should have returned the existing record")
        self.assertEqual(result.plan, self.test_workout_plan2, "The workout plan was not updated as expected")
        self.assertEqual(result.day, self.test_day4, "The day was not updated as expected")
        self.assertEqual(result.start_date, date.today(), "The start date was not updated to today")
        self.assertEqual(
            existing_active_workout_plans,
            ActiveWorkoutPlan.objects.all().count(),
            "No new ActiveWorkoutPlan records should have been created",
        )
        updated_query = ActiveWorkoutPlan.objects.get(pk=self.test_active_plan.id)
        self.assertEqual(result.last_modified, updated_query.last_modified, "The last modified should be the same")

        # create an active workout plan for user3
        result = ActiveWorkoutPlanDomain.start_new_workout_plan(self.test_user3.id, self.test_workout_plan4.id)
        self.assertIsNotNone(result, "Should have returned a non None value")
        self.assertEqual(result.plan, self.test_workout_plan4, "The workout plan was not updated as expected")
        self.assertEqual(result.day, self.test_day6, "The day was not updated as expected")
        self.assertEqual(result.start_date, date.today(), "The start date was not updated to today")
        self.assertEqual(
            existing_active_workout_plans + 1,
            ActiveWorkoutPlan.objects.all().count(),
            "A new ActiveWorkoutPlan records should have been created",
        )

    def test_start_new_workout_plan_not_plan_owner(self):
        existing_active_workout_plans = ActiveWorkoutPlan.objects.all().count()

        # create an active workout plan for user3
        result = ActiveWorkoutPlanDomain.start_new_workout_plan(self.test_user3.id, self.test_workout_plan2.id)
        self.assertIsNone(result, "No record should have been returned since the user isn't the owner of the plan")
        self.assertEqual(
            existing_active_workout_plans,
            ActiveWorkoutPlan.objects.all().count(),
            "No new records should have been created",
        )
