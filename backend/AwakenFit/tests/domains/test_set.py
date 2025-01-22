from django.contrib.auth.models import User
from django.test import TestCase

from graphene import Int

from ...models import Movement
from ...models import Exercise
from ...models import Workout
from ...models import Set

from ...domains import SetDomain

from ...schema.set import (
    SetCreateCompletedInput,
    SetCreateTemplateInput,
    SetCreateCompletedParentInput,
    SetCreateTemplateParentInput,
)


class SetDomainTest(TestCase):
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
            name="BB Bench Press",
            description="This is a test movement",
            primary_muscle_group=Movement.CHEST,
            secondary_muscle_group=Movement.TRICEPS,
            equipment_type=Movement.BARBELL,
            movement_type=Movement.STRENGTH,
        )

        self.test_workout = Workout.objects.create(user=self.test_user, template=False, notes="Test Workout")
        self.test_workout2 = Workout.objects.create(user=self.test_user, template=True, notes="Test Template Workout")

        self.test_exercise = Exercise.objects.create(
            movement=self.test_movement, workout=self.test_workout, intensity=1, notes="Test Exercise notes"
        )
        self.test_exercise2 = Exercise.objects.create(
            movement=self.test_movement2, workout=self.test_workout2, intensity=1, notes="Test Exercise notes"
        )

        self.COMPLETED_REPS_1 = 10
        self.WEIGHT_1 = 135
        self.test_set = Set.objects.create(
            exercise=self.test_exercise,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
        )
        self.COMPLETED_REPS_2 = 8
        self.WEIGHT_2 = 155
        self.test_set2 = Set.objects.create(
            exercise=self.test_exercise,
            completed_reps=self.COMPLETED_REPS_2,
            weight=self.WEIGHT_2,
        )
        self.test_set3 = Set.objects.create(
            exercise=self.test_exercise2,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
        )

    def test_get_by_id(self):
        self.assertEqual(
            self.test_set,
            SetDomain.get_by_id(self.test_set.id),
            "Failed to get the expected record back",
        )
        self.assertEqual(
            self.test_set2,
            SetDomain.get_by_id(self.test_set2.id),
            "Failed to get the expected record back",
        )

    def test_get_by_id_set(self):
        id_set = set([self.test_set.id, self.test_set2.id])
        result = SetDomain.get_by_id_set(id_set)
        self.assertEqual(2, len(result), "Did not get the appropriate number of records back")
        test_sets = [self.test_set, self.test_set2]
        for entry in result:
            self.assertTrue(entry in test_sets, "Query returned an unexpected record")

    def test_get_by_exercise_id(self):
        result = SetDomain.get_by_exercise_id(self.test_exercise.id)
        self.assertEqual(2, len(result), "Did not get the appropriate number of records back")
        test_sets = [self.test_set, self.test_set2]
        for entry in result:
            self.assertTrue(entry in test_sets, "Query returned an unexpected record")

    def test_calculate_one_rep_max(self):
        expected_result = int(((self.WEIGHT_1 * self.COMPLETED_REPS_1) / 30.48) + self.WEIGHT_1)
        self.assertEqual(
            expected_result, SetDomain.calculate_one_rep_max(self.test_set), "The calculated 1RM is not as expected"
        )

    def test_calculate_set_volume(self):
        self.assertEqual(
            self.COMPLETED_REPS_1 * self.WEIGHT_1,
            SetDomain.calculate_set_volume(self.test_set),
            "The calculated set volume was not correct",
        )
        self.assertEqual(
            self.COMPLETED_REPS_2 * self.WEIGHT_2,
            SetDomain.calculate_set_volume(self.test_set2),
            "The calculated set volume was not correct",
        )

    def test_validate_template_standard_set(self):
        ONE_MINUTE_DURATION = "00H01M00S"
        standard_template_set = type(
            "SetCreateCompletedInput",
            (object,),
            {"sequence_number": 1, "min_reps": 1, "max_reps": 6},
        )
        standard_template_set2 = type(
            "SetCreateCompletedInput",
            (object,),
            {"sequence_number": 1, "duration": ONE_MINUTE_DURATION},
        )
        self.assertEqual(
            0,
            len(SetDomain.validate_template_standard_set(standard_template_set)),
            "No errors should have been returned",
        )
        self.assertEqual(
            0,
            len(SetDomain.validate_template_standard_set(standard_template_set2)),
            "No errors should have been returned",
        )

    def test_validate_completed_standard_set(self):
        ONE_MINUTE_DURATION = "00H01M00S"
        standard_completed_set = type(
            "SetCreateCompletedInput",
            (object,),
            {"sequence_number": 1, "completed_reps": self.COMPLETED_REPS_1, "weight": self.WEIGHT_1},
        )
        standard_completed_set2 = type(
            "SetCreateCompletedInput",
            (object,),
            {"sequence_number": 1, "duration": ONE_MINUTE_DURATION, "weight": self.WEIGHT_1},
        )

        result = SetDomain.validate_completed_standard_set(standard_completed_set)
        self.assertEqual(
            0,
            len(result),
            "No errors should have been returned",
        )

        result2 = SetDomain.validate_completed_standard_set(standard_completed_set2)
        self.assertEqual(
            0,
            len(result2),
            "No errors should have been returned",
        )

    def test_validate_standard_set_bad_input(self):
        standard_completed_set = None
        standard_template_set = None

    def test_validate_non_standard_set(self):
        pass

    def test_create_parent_non_standard_set(self):
        existing_sets = Set.objects.count()

        result = SetDomain.create_parent_non_standard_set(self.test_exercise.id, Set.SUPER_SET)

        self.assertIsNotNone(result, "Should have resulted in a Set record being returned")

        updated_sets = Set.objects.count()
        self.assertNotEqual(existing_sets, updated_sets, "New Set should have been created")
        self.assertEqual(existing_sets + 1, updated_sets)

    def test_create_parent_non_stardard_set_bad_input(self):
        existing_sets = Set.objects.count()

        result = SetDomain.create_parent_non_standard_set(12345, Set.SUPER_SET)

        self.assertIsNone(result, "Should have resulted in a None being returned")

        updated_sets = Set.objects.count()
        self.assertEqual(existing_sets, updated_sets, "New Set should not have been created")

    def test_create_template_set(self):
        existing_sets = Set.objects.count()

        result = SetDomain.create_template_set(self.test_exercise.id, sequence_number=1, min_reps=4, max_reps=6)

        self.assertIsNotNone(result, "Should have resulted in a Set record being returned")

        updated_sets = Set.objects.count()
        self.assertNotEqual(existing_sets, updated_sets, "New Set should have been created")
        self.assertEqual(existing_sets + 1, updated_sets)

    def test_create_template_set_bad_input(self):
        existing_sets = Set.objects.count()

        result = SetDomain.create_template_set(12345, sequence_number=1, min_reps=4, max_reps=6)

        self.assertIsNone(result, "Should not have resulted in a Set record being returned")

        updated_sets = Set.objects.count()
        self.assertEqual(existing_sets, updated_sets, "New Set should not have been created")

    def test_create_completed_set(self):
        existing_sets = Set.objects.count()

        result = SetDomain.create_completed_set(
            self.test_exercise.id,
            1,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
        )

        self.assertIsNotNone(result, "Should have resulted in a Set record being returned")

        updated_sets = Set.objects.count()
        self.assertNotEqual(existing_sets, updated_sets, "New Set should have been created")
        self.assertEqual(existing_sets + 1, updated_sets)

    def test_create_completed_set_bad_input(self):
        existing_sets = Set.objects.count()

        result = SetDomain.create_completed_set(
            12345,
            1,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
        )

        self.assertIsNone(result, "Should not have resulted in a Set record being returned")

        updated_sets = Set.objects.count()
        self.assertEqual(existing_sets, updated_sets, "New Set should not have been created")

    def test_create_set(self):
        pass
