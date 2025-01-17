from django.test import TestCase

from ...models import Movement
from ...domains import MovementDomain


class MovementDomainTest(TestCase):
    def setUp(self):
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
            description="This is a test movement 2",
            primary_muscle_group=Movement.CHEST,
            secondary_muscle_group=Movement.TRICEPS,
            equipment_type=Movement.BARBELL,
            movement_type=Movement.STRENGTH,
        )
        self.test_movement3 = Movement.objects.create(
            name="BB RDL",
            description="This is a test movement 3",
            primary_muscle_group=Movement.HAMSTRING,
            secondary_muscle_group=Movement.NONE,
            equipment_type=Movement.BARBELL,
            movement_type=Movement.STRENGTH,
        )
        self.test_movement4 = Movement.objects.create(
            name="DB Split",
            description="This is a test movement 3",
            primary_muscle_group=Movement.HAMSTRING,
            secondary_muscle_group=Movement.QUADRICEPS,
            equipment_type=Movement.BARBELL,
            movement_type=Movement.STRENGTH,
        )

    def test_get_by_id(self):
        self.assertEqual(
            self.test_movement,
            MovementDomain.get_by_id(self.test_movement.id),
            "Failed to get the expected record back",
        )
        self.assertEqual(
            self.test_movement2,
            MovementDomain.get_by_id(self.test_movement2.id),
            "Failed to get the expected record back",
        )

    def test_get_by_id_set(self):
        id_set = set([self.test_movement.id, self.test_movement2.id])
        result = MovementDomain.get_by_id_set(id_set)
        self.assertEqual(2, len(result), "Did not get the appropriate number of records back")
        # need to check the result includes the records I expected

    def test_get_by_name(self):
        result = MovementDomain.get_by_name("squat")
        self.assertEqual(1, len(result), "Did not get the appropriate number of records back")
        self.assertEqual(self.test_movement, result[0], "Expected to get a squat movement back")

        result = MovementDomain.get_by_name("BB")
        self.assertEqual(3, len(result), "Did not get the appropriate number of records back")

    def test_get_by_muscle_group(self):
        result = MovementDomain.get_by_muscle_group(Movement.QUADRICEPS)
        self.assertEqual(2, len(result), "Did not get the appropriate number of records back")

        result = MovementDomain.get_by_muscle_group(Movement.CHEST)
        self.assertEqual(1, len(result), "Did not get the appropriate number of records back")

    def test_get_by_equipment_type(self):
        result = MovementDomain.get_by_equipment_type(Movement.BARBELL)
        self.assertEqual(4, len(result), "Did not get the appropriate number of records back")

    def test_get_by_movement_type(self):
        result = MovementDomain.get_by_movement_type(Movement.STRENGTH)
        self.assertEqual(4, len(result), "Did not get the appropriate number of records back")

    def test_create_movement(self):
        existing_movements = Movement.objects.count()

        result = MovementDomain.create_movement(
            "Test Movement",
            "This is a test create movement",
            Movement.TRICEPS,
            Movement.NONE,
            Movement.DUMBBELL,
            Movement.STRENGTH,
        )
        self.assertIsNotNone(result, "Should have resulted in a Movement record being returned")

        updated_movements = Movement.objects.count()

        self.assertNotEqual(existing_movements, updated_movements, "New movement should have been created")
        self.assertEqual(existing_movements + 1, updated_movements)

    def test_create_movement_long_name(self):
        existing_movements = Movement.objects.count()

        result = MovementDomain.create_movement(
            "A" * (MovementDomain.MAX_NAME_LENGTH + 5),
            "This is a test create movement",
            Movement.TRICEPS,
            Movement.NONE,
            Movement.DUMBBELL,
            Movement.STRENGTH,
        )

        self.assertIsNotNone(result, "Should have resulted in created a new record")
        self.assertEqual(len(result.name), MovementDomain.MAX_NAME_LENGTH, "Name should have been truncated")
        updated_movements = Movement.objects.count()
        self.assertEqual(existing_movements + 1, updated_movements)

    def test_create_movement_long_description(self):
        existing_movements = Movement.objects.count()

        result = MovementDomain.create_movement(
            "Test Movement",
            "A" * (MovementDomain.MAX_DESCRIPTION_LENGTH + 5),
            Movement.TRICEPS,
            Movement.NONE,
            Movement.DUMBBELL,
            Movement.STRENGTH,
        )

        self.assertIsNotNone(result, "Should have resulted in created a new record")
        self.assertEqual(
            len(result.description), MovementDomain.MAX_DESCRIPTION_LENGTH, "Name should have been truncated"
        )
        updated_movements = Movement.objects.count()
        self.assertEqual(existing_movements + 1, updated_movements)

    def test_create_movement_bad_primary_muscle_group(self):
        existing_movements = Movement.objects.count()

        result = MovementDomain.create_movement(
            "Test Movement",
            "This is a test create movement",
            "Not a real muscle group",
            Movement.NONE,
            Movement.DUMBBELL,
            Movement.STRENGTH,
        )

        self.assertIsNone(result, "Should not have resulted in created a new record")
        updated_movements = Movement.objects.count()
        self.assertEqual(existing_movements, updated_movements)

    def test_create_movement_bad_secondary_muscle_group(self):
        existing_movements = Movement.objects.count()

        result = MovementDomain.create_movement(
            "Test Movement",
            "This is a test create movement",
            Movement.TRICEPS,
            "Not a real muscle group",
            Movement.DUMBBELL,
            Movement.STRENGTH,
        )

        self.assertIsNone(result, "Should not have resulted in created a new record")
        updated_movements = Movement.objects.count()
        self.assertEqual(existing_movements, updated_movements)

    def test_create_movement_bad_equipment(self):
        existing_movements = Movement.objects.count()

        result = MovementDomain.create_movement(
            "Test Movement",
            "This is a test create movement",
            Movement.TRICEPS,
            Movement.NONE,
            "Not real equipment",
            Movement.STRENGTH,
        )

        self.assertIsNone(result, "Should not have resulted in created a new record")
        updated_movements = Movement.objects.count()
        self.assertEqual(existing_movements, updated_movements)

    def test_create_movement_bad_movement(self):
        existing_movements = Movement.objects.count()

        result = MovementDomain.create_movement(
            "Test Movement",
            "This is a test create movement",
            Movement.TRICEPS,
            Movement.NONE,
            Movement.DUMBBELL,
            "Not real movement type",
        )

        self.assertIsNone(result, "Should not have resulted in created a new record")
        updated_movements = Movement.objects.count()
        self.assertEqual(existing_movements, updated_movements)
