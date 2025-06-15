import json

from graphql_relay import to_global_id, from_global_id

from graphene_django.utils.testing import GraphQLTestCase

from django.contrib.auth.models import User

from AwakenFit.models import Movement

from AwakenFit.domains import user as UserDomain
from AwakenFit.domains import mutation as MutationDomain


class MovementSchemaTest(GraphQLTestCase):
    def setUp(self):
        self.GRAPHQL_URL = "/api/graphql"

        self.test_user = User.objects.create_user("testuser1", "testemail@email.com", "testpassword1")
        self.test_super_user = User.objects.create_superuser("testuser2", "testemail2@email.com", "testpassword2")
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
        self.movement_create_mutation = """
            mutation movementCreate(
                $name:String!,
                $description:String!,
                $primaryMuscleGroup:String!,
                $secondaryMuscleGroup:String!,
                $equipmentType:String!,$movementType:String!
            ) {
                movementCreate(input: {name: $name,
                                       description: $description,
                                       primaryMuscleGroup: $primaryMuscleGroup,
                                       secondaryMuscleGroup: $secondaryMuscleGroup,
                                       equipmentType: $equipmentType,
                                       movementType: $movementType}) {
                    movement {
                        id
                    }
                    errors {
                        message
                    }
                }
            }
            """
        self.movement_edit_mutation = """
            mutation movementEdit(
                $id: ID!,
                $description:String,
                $primaryMuscleGroup:String!,
                $secondaryMuscleGroup:String!,
                $equipmentType:String!,
                $movementType:String!
            ) {
                movementEdit(input: {id: $id,
                                     description: $description,
                                     primaryMuscleGroup: $primaryMuscleGroup,
                                     secondaryMuscleGroup: $secondaryMuscleGroup,
                                     equipmentType: $equipmentType,
                                     movementType: $movementType}) {
                    movement {
                        id
                    }
                    errors {
                        message
                    }
                }
            }
            """

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

    def test_movement_create_mutation(self):
        self.assertFalse(
            Movement.objects.filter(name="Deadlift").exists(),
            "This movement should not exist before the mutation is called.",
        )

        self.client.login(username="testuser2", password="testpassword2")
        response = self.query(
            self.movement_create_mutation,
            operation_name="movementCreate",
            variables={
                "name": "Deadlift",
                "description": "This is a test description",
                "primaryMuscleGroup": "Back",
                "secondaryMuscleGroup": "Glutes",
                "equipmentType": "Barbell",
                "movementType": "Strength",
            },
        )

        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertIsNotNone(content["data"]["movementCreate"]["movement"])
        self.assertEqual(0, len(content["data"]["movementCreate"]["errors"]))
        self.assertTrue(Movement.objects.filter(name="Deadlift").exists())

    def test_movement_edit_mutation(self):
        self.assertTrue(
            Movement.objects.filter(name=self.test_movement.name).exists(),
            "This movement should exist before the mutation is called.",
        )

        updated_description = "This is an updated test description that is not super long"
        updated_pmg = "Back"
        updated_smg = "Glutes"
        updated_et = "Dumbbell"
        updated_mt = "Strength"

        self.client.login(username="testuser2", password="testpassword2")
        response = self.query(
            self.movement_edit_mutation,
            operation_name="movementEdit",
            variables={
                "id": self.test_movement.id,
                "description": updated_description,
                "primaryMuscleGroup": updated_pmg,
                "secondaryMuscleGroup": updated_smg,
                "equipmentType": updated_et,
                "movementType": updated_mt,
            },
        )

        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertIsNotNone(content["data"]["movementEdit"])
        self.assertIsNotNone(content["data"]["movementEdit"]["movement"])
        self.assertEqual(0, len(content["data"]["movementEdit"]["errors"]))
        _, retrieved_id = from_global_id(content["data"]["movementEdit"]["movement"]["id"])
        self.assertEqual(self.test_movement.id, int(retrieved_id))

        updated_movement = Movement.objects.get(id=self.test_movement.id)

        self.assertEqual(updated_movement.description, updated_description)
        self.assertEqual(updated_movement.primary_muscle_group, updated_pmg)
        self.assertEqual(updated_movement.secondary_muscle_group, updated_smg)
        self.assertEqual(updated_movement.equipment_type, updated_et)
        self.assertEqual(updated_movement.movement_type, updated_mt)

    def test_movement_create_mutation_bad_input(self):
        pass

    def test_movement_edit_mutation_bad_input(self):
        self.assertTrue(
            Movement.objects.filter(name=self.test_movement.name).exists(),
            "This movement should exist before the mutation is called.",
        )

        updated_description = "This is an updated test description that is not super long"
        updated_pmg = "Back"
        updated_smg = "Glutes"
        updated_et = "Dumbbell"
        updated_mt = "Strength"

        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            self.movement_edit_mutation,
            operation_name="movementEdit",
            variables={
                "id": self.test_movement.id,
                "description": updated_description,
                "primaryMuscleGroup": updated_pmg,
                "secondaryMuscleGroup": updated_smg,
                "equipmentType": updated_et,
                "movementType": updated_mt,
            },
        )

        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertIsNotNone(content["data"]["movementEdit"])
        self.assertIsNone(content["data"]["movementEdit"]["movement"])
        self.assertNotEqual(0, len(content["data"]["movementEdit"]["errors"]))
        expected_errors = [UserDomain.ERROR_MESSAGES.get("MISSING_PERMISSIONS")]
        for error in content["data"]["movementEdit"]["errors"]:
            self.assertTrue(error.get("message") in expected_errors, "Received an un-expected error message")

        self.client.login(username="testuser2", password="testpassword2")
        response = self.query(
            self.movement_edit_mutation,
            operation_name="movementEdit",
            variables={
                "id": self.test_movement.id,
                "description": updated_description,
                "primaryMuscleGroup": "None",
                "secondaryMuscleGroup": "None",
                "equipmentType": updated_et,
                "movementType": updated_mt,
            },
        )

        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertIsNotNone(content["data"]["movementEdit"])
        self.assertIsNone(content["data"]["movementEdit"]["movement"])
        self.assertNotEqual(0, len(content["data"]["movementEdit"]["errors"]))
        expected_errors = [MutationDomain.ERROR_MESSAGES.get("MISSING_MUSCLE_GROUP")]
        for error in content["data"]["movementEdit"]["errors"]:
            self.assertTrue(error.get("message") in expected_errors, "Received an un-expected error message")
