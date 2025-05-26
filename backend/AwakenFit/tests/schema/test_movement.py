import json

from graphql_relay import to_global_id

from graphene_django.utils.testing import GraphQLTestCase

from django.contrib.auth.models import User

from AwakenFit.models import Movement


class MovementSchemaTest(GraphQLTestCase):
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

    def test_individual_movement_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query movement($id: ID!) {
                movement(id: $id) {
                    id
                    name
                    description
                }
            }
            """,
            operation_name="movement",
            variables={"id": to_global_id("MovementNode", self.test_movement.id)},
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertEqual(self.test_movement.name, content["data"]["movement"]["name"])

    def test_movement_list_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query movements {
                movements {
                    edges {
                        node {
                            id
                            name
                            description
                        }
                    }
                }
            }
            """,
            operation_name="movements",
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertEqual(2, len(content["data"]["movements"]["edges"]))
