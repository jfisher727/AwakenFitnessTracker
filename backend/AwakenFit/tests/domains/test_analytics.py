from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import pytz

from django.contrib.auth.models import User
from django.test import TestCase
from freezegun import freeze_time

from AwakenFit.models import Movement, Exercise, Workout, Set

from AwakenFit.domains import analytics as AnalyticsDomain
import pytz.zoneinfo


@freeze_time("2025-05-10")
class AnalyticsDomainTest(TestCase):

    def setUp(self):
        self.test_user = User.objects.create_user("testusername", "testemail@email.com", "testpassword1")
        self.test_user2 = User.objects.create_user("testusername2", "testemail2@email.com", "testpassword2")

        bb_squat = Movement.objects.create(
            name="BB Squats",
            description="This is a test movement",
            primary_muscle_group=Movement.QUADRICEPS,
            secondary_muscle_group=Movement.ABDOMINALS,
            equipment_type=Movement.BARBELL,
            movement_type=Movement.STRENGTH,
        )
        bb_bench_press = Movement.objects.create(
            name="BB Bench Press",
            description="This is a test movement",
            primary_muscle_group=Movement.CHEST,
            secondary_muscle_group=Movement.TRICEPS,
            equipment_type=Movement.BARBELL,
            movement_type=Movement.STRENGTH,
        )

        start_time = datetime(2025, 5, 5, 4, 30, 0, 0, tzinfo=pytz.timezone("America/New_York"))
        stop_time = start_time + timedelta(minutes=45)
        test_workout = Workout.objects.create(
            user=self.test_user, start_time=start_time, stop_time=stop_time, template=False, notes="Test Workout"
        )

        test_exercise = Exercise.objects.create(
            movement=bb_bench_press, workout=test_workout, intensity=1, notes="Test Exercise notes"
        )

        self.COMPLETED_REPS_1 = 10
        self.WEIGHT_1 = 135
        self.bb_bench_set1_volume = self.COMPLETED_REPS_1 * self.WEIGHT_1
        Set.objects.create(
            exercise=test_exercise,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
        )
        self.COMPLETED_REPS_2 = 8
        self.WEIGHT_2 = 155
        self.bb_bench_set2_volume = self.COMPLETED_REPS_2 * self.WEIGHT_2
        Set.objects.create(
            exercise=test_exercise,
            completed_reps=self.COMPLETED_REPS_2,
            weight=self.WEIGHT_2,
        )
        self.COMPLETED_REPS_3 = 6
        self.WEIGHT_3 = 175
        self.bb_bench_set3_volume = self.COMPLETED_REPS_3 * self.WEIGHT_3
        Set.objects.create(
            exercise=test_exercise,
            completed_reps=self.COMPLETED_REPS_3,
            weight=self.WEIGHT_3,
        )

        # create workout number 2
        start_time = datetime(2025, 5, 6, 4, 30, 0, 0, tzinfo=ZoneInfo("America/New_York"))
        stop_time = start_time + timedelta(minutes=45)
        test_workout2 = Workout.objects.create(
            user=self.test_user, start_time=start_time, stop_time=stop_time, template=False, notes="Test Workout 2"
        )

        test_exercise = Exercise.objects.create(
            movement=bb_squat, workout=test_workout2, intensity=1, notes="Test Exercise notes"
        )

        self.COMPLETED_REPS_1 = 10
        self.WEIGHT_1 = 135
        self.bb_squat_set1_volume = self.COMPLETED_REPS_1 * self.WEIGHT_1
        Set.objects.create(
            exercise=test_exercise,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
        )
        self.COMPLETED_REPS_2 = 6
        self.WEIGHT_2 = 185
        self.bb_squat_set2_volume = self.COMPLETED_REPS_2 * self.WEIGHT_2
        Set.objects.create(
            exercise=test_exercise,
            completed_reps=self.COMPLETED_REPS_2,
            weight=self.WEIGHT_2,
        )
        self.COMPLETED_REPS_3 = 6
        self.WEIGHT_3 = 205
        self.bb_squat_set3_volume = self.COMPLETED_REPS_3 * self.WEIGHT_3
        Set.objects.create(
            exercise=test_exercise,
            completed_reps=self.COMPLETED_REPS_3,
            weight=self.WEIGHT_3,
        )
        self.COMPLETED_REPS_4 = 6
        self.WEIGHT_4 = 255
        self.bb_squat_set4_volume = self.COMPLETED_REPS_4 * self.WEIGHT_4
        Set.objects.create(
            exercise=test_exercise,
            completed_reps=self.COMPLETED_REPS_4,
            weight=self.WEIGHT_4,
        )
        self.COMPLETED_REPS_5 = 6
        self.WEIGHT_4 = 235
        self.bb_squat_set5_volume = self.COMPLETED_REPS_4 * self.WEIGHT_4
        Set.objects.create(
            exercise=test_exercise,
            completed_reps=self.COMPLETED_REPS_4,
            weight=self.WEIGHT_4,
        )

        self.total_volume = sum(
            [
                self.bb_bench_set1_volume,
                self.bb_bench_set2_volume,
                self.bb_bench_set3_volume,
                self.bb_squat_set1_volume,
                self.bb_squat_set2_volume,
                self.bb_squat_set3_volume,
                self.bb_squat_set4_volume,
                self.bb_squat_set5_volume,
            ]
        )

    def test_week_in_review(self):
        result = AnalyticsDomain.calculate_week_summary(self.test_user.id)
        self.assertTrue("total_workouts" in result.keys(), "No total workouts provided")
        self.assertTrue("total_volume" in result.keys(), "No total_volume provided")
        self.assertTrue("top_muscle_group" in result.keys(), "No top_muscle_group provided")
        self.assertTrue("total_cardio" in result.keys(), "No total_cardio provided")
        self.assertTrue("favorite_equipment" in result.keys(), "No favorite_equipment provided")

        self.assertEqual(result["total_workouts"], 2, "Did not get the expected number of workouts back")
        self.assertEqual(result["total_volume"], str(self.total_volume), "Did not receive the expected volume")
        self.assertEqual(result["favorite_equipment"], "Barbell", "Did not receive the expected favorite equipment")

    def test_week_in_review_no_workouts(self):
        result = AnalyticsDomain.calculate_week_summary(self.test_user2.id)
        self.assertEqual(
            "No workouts recorded for this week",
            result["message"],
            "The user should not have any analytics calculatted",
        )
