from django.contrib.auth.models import User
from django.test import TestCase

from ...models import Movement
from ...models import Exercise
from ...models import Workout
from ...models import Set


class SetModelTest(TestCase):

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

        self.test_workout = Workout.objects.create(user=self.test_user, template=False, notes="Test Workout")

        self.test_exercise = Exercise.objects.create(
            movement=self.test_movement, workout=self.test_workout, intensity=1, notes="Test Exercise notes"
        )
        self.test_exercise2 = Exercise.objects.create(
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
            exercise=self.test_exercise,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
            parent_set=self.parent_set,
        )
        self.child_set2 = Set.objects.create(
            exercise=self.test_exercise2,
            completed_reps=self.COMPLETED_REPS_1,
            weight=self.WEIGHT_1,
            parent_set=self.parent_set,
        )

    def test_to_json(self):
        self.assertEqual(
            '{"reps": %d, "weight": %d}' % (self.COMPLETED_REPS_1, self.WEIGHT_1),
            self.test_set.to_json(json_dump=True),
            "Did not get the expected message back",
        )
        self.assertEqual(
            '{"weight": %d, "duration": "%s"}' % (self.WEIGHT_1, self.COMPLETED_DURATION),
            self.test_set2.to_json(json_dump=True),
            "Did not get the expected message back",
        )
        self.assertEqual(
            '{"duration": "%s"}' % self.COMPLETED_DURATION,
            self.test_set3.to_json(json_dump=True),
            "Did not get the expected message back",
        )

    def test_to_json_parent_set(self):
        self.assertEqual(
            '{"setType": "Super Set", "sets": [{"reps": 10, "weight": 135, "exercise": "BB Squats"}, {"reps": 10, "weight": 135, "exercise": "BB Bench"}]}',
            self.parent_set.to_json(json_dump=True),
        )
