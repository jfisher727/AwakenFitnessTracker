import json

from graphql_relay import to_global_id

from graphene_django.utils.testing import GraphQLTestCase

from django.contrib.auth.models import User

from AwakenFit.models import Movement, Workout, Exercise, Set
from AwakenFit.domains import set as SetDomain


class SetSchemaTest(GraphQLTestCase):
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

    def test_individual_set_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query set($id: ID!) {
                set(id: $id) {
                    id
                    sequenceNumber
                    oneRepMax
                    volume
                }
            }
            """,
            operation_name="set",
            variables={"id": to_global_id("SetNode", self.test_set2.id)},
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertEqual(self.test_set2.sequence_number, content["data"]["set"]["sequenceNumber"])
        self.assertEqual(SetDomain.calculate_one_rep_max(self.test_set2), content["data"]["set"]["oneRepMax"])
        self.assertEqual(SetDomain.calculate_set_volume(self.test_set2), content["data"]["set"]["volume"])

    def test_set_list_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query sets {
                sets {
                    edges {
                        node {
                            id
                            sequenceNumber
                        }
                    }
                }
            }
            """,
            operation_name="sets",
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertEqual(3, len(content["data"]["sets"]["edges"]))
