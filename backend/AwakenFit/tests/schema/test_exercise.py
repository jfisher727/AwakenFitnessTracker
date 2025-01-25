import json

from graphql_relay import to_global_id, from_global_id

from graphene_django.utils.testing import GraphQLTestCase

from django.contrib.auth.models import User

from ...models import Movement, Workout, Exercise


class ExerciseSchemaTest(GraphQLTestCase):
    def setUp(self):
        self.GRAPHQL_URL = "/api/graphql"

        self.test_user = User.objects.create_user("testuser1", "testemail@email.com", "testpassword1")
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

    def test_individual_exercise_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query exercise($id: ID!) {
                exercise(id: $id) {
                    id
                    intensity
                    notes
                }
            }
            """,
            operation_name="exercise",
            variables={"id": to_global_id("ExerciseNode", self.test_exercise.id)},
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertEqual(self.test_exercise.id, int(from_global_id(content["data"]["exercise"]["id"]).id))

    def test_exercise_list_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query exercises {
                exercises {
                    edges {
                        node {
                            id
                            intensity
                            notes
                        }
                    }
                }
            }
            """,
            operation_name="exercises",
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertEqual(2, len(content["data"]["exercises"]["edges"]))
