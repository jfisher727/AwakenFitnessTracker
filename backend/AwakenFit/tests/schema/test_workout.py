import json
from datetime import datetime, timedelta, UTC
from datetime import timedelta

from graphql_relay import to_global_id

from graphene_django.utils.testing import GraphQLTestCase

from django.contrib.auth.models import User
from django.utils import timezone

from AwakenFit.models import Movement, Workout, Exercise, Set


class WorkoutSchemaTest(GraphQLTestCase):
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

        day1 = datetime(2025, 3, 1, 8, 30, tzinfo=UTC)
        day2 = day1 + timedelta(days=1)
        day3 = day2 + timedelta(days=1)

        self.test_workout3 = Workout.objects.create(
            user=self.test_user,
            template=False,
            notes="Test Workout 3",
            start_time=day1,
            stop_time=(day1 + timedelta(minutes=45)),
        )
        self.test_workout4 = Workout.objects.create(
            user=self.test_user,
            template=False,
            notes="Test Workout 4",
            start_time=day2,
            stop_time=(day2 + timedelta(minutes=45)),
        )
        self.test_workout5 = Workout.objects.create(
            user=self.test_user,
            template=False,
            notes="Test Workout 5",
            start_time=day3,
            stop_time=(day3 + timedelta(minutes=45)),
        )

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
        self.workout_create_template_mutation = """
            mutation workoutCreateTemplate(
                $name: String!,
                $notes: String,
                $exercises: [ExerciseCreateTemplateInput]!
            ) {
                workoutCreateTemplate(input: {name: $name,
                                              notes: $notes,
                                              exercises: $exercises}) {
                    workout {
                        id
                    }
                    errors {
                        message
                    }
                }
            }
        """
        self.workout_create_completed_mutation = """
            mutation workoutCreateCompleted(
                $notes: String,
                $startTime: DateTime!,
                $stopTime: DateTime!,
                $templateId: ID,
                $exercises: [ExerciseCreateCompletedInput]!
            ) {
                workoutCreateCompleted(input: {notes: $notes,
                                              startTime: $startTime,
                                              stopTime: $stopTime,
                                              templateId: $templateId,
                                              exercises: $exercises}) {
                    workout {
                        id
                    }
                    errors {
                        message
                    }
                }
            }
        """

    def test_individual_workout_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query workout($id: ID!) {
                workout(id: $id) {
                    id
                    startTime
                    stopTime
                    template
                    notes
                }
            }
            """,
            operation_name="workout",
            variables={"id": to_global_id("WorkoutNode", self.test_workout.id)},
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertFalse(content["data"]["workout"]["template"])

    def test_workout_list_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query workouts {
                workouts {
                    edges {
                        node {
                            id
                            startTime
                            stopTime
                            template
                            notes
                        }
                    }
                }
            }
            """,
            operation_name="workouts",
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertEqual(Workout.objects.all().count(), len(content["data"]["workouts"]["edges"]))

    def test_workout_filterset_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query workouts {
                workouts(startMonth: 3, startYear: 2025) {
                    edges {
                        node {
                            id
                            startTime
                            stopTime
                            template
                            notes
                        }
                    }
                }
            }
            """,
            operation_name="workouts",
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertEqual(3, len(content["data"]["workouts"]["edges"]))
        test_notes = ["Test Workout 3", "Test Workout 4", "Test Workout 5"]
        for entry in content["data"]["workouts"]["edges"]:
            self.assertTrue(entry["node"]["notes"] in test_notes, "Got an unexpected workout")

    def test_workout_create_template_mutation(self):
        self.assertFalse(Workout.objects.filter(notes="Mutation Test Note").exists())

        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            self.workout_create_template_mutation,
            operation_name="workoutCreateTemplate",
            variables={
                "notes": "Mutation Test Note",
                "name": "Test Template name",
                "exercises": [
                    {
                        "movementId": to_global_id("Movement", self.test_movement.id),
                        "standardSets": [
                            {"sequenceNumber": 1, "minReps": 4, "maxReps": 6},
                            {"sequenceNumber": 2, "minReps": 4, "maxReps": 6},
                            {"sequenceNumber": 3, "minReps": 4, "maxReps": 6},
                        ],
                    },
                    {
                        "movementId": to_global_id("Movement", self.test_movement2.id),
                        "nonStandardSets": {
                            "setType": "Drop Set",
                            "associatedSets": [
                                {"sequenceNumber": 1, "minReps": 4, "maxReps": 6},
                                {"sequenceNumber": 2, "minReps": 4, "maxReps": 6},
                                {"sequenceNumber": 3, "minReps": 4, "maxReps": 6},
                            ],
                        },
                    },
                ],
            },
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertIsNotNone(content["data"]["workoutCreateTemplate"]["workout"])
        self.assertEqual(0, len(content["data"]["workoutCreateTemplate"]["errors"]))
        self.assertTrue(Workout.objects.filter(notes="Mutation Test Note").exists())

    def test_workout_create_completed_mutation(self):
        self.assertFalse(Workout.objects.filter(notes="Mutation Test Note").exists())

        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            self.workout_create_completed_mutation,
            operation_name="workoutCreateCompleted",
            variables={
                "notes": "Mutation Test Note",
                "startTime": timezone.now().isoformat(),
                "stopTime": (timezone.now() + timedelta(minutes=30)).isoformat(),
                "exercises": [
                    {
                        "movementId": to_global_id("Movement", self.test_movement.id),
                        "standardSets": [
                            {"sequenceNumber": 1, "completedReps": 4, "weight": 135},
                            {"sequenceNumber": 2, "completedReps": 4, "weight": 135},
                            {"sequenceNumber": 3, "completedReps": 4, "weight": 135},
                        ],
                    },
                    {
                        "movementId": to_global_id("Movement", self.test_movement2.id),
                        "nonStandardSets": {
                            "setType": "Drop Set",
                            "associatedSets": [
                                {"sequenceNumber": 1, "completedReps": 4, "weight": 135},
                                {"sequenceNumber": 2, "completedReps": 4, "weight": 115},
                                {"sequenceNumber": 3, "completedReps": 4, "weight": 105},
                            ],
                        },
                    },
                ],
            },
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertIsNotNone(content["data"]["workoutCreateCompleted"]["workout"])
        self.assertEqual(0, len(content["data"]["workoutCreateCompleted"]["errors"]))
        self.assertTrue(Workout.objects.filter(notes="Mutation Test Note").exists())

    def test_workout_create_completed_mutation_optional_template_id(self):
        self.assertFalse(Workout.objects.filter(notes="Mutation Test Note").exists())

        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            self.workout_create_completed_mutation,
            operation_name="workoutCreateCompleted",
            variables={
                "notes": "Mutation Test Note 2",
                "startTime": timezone.now().isoformat(),
                "stopTime": (timezone.now() + timedelta(minutes=30)).isoformat(),
                "templateId": to_global_id("Workout", self.test_workout2.id),
                "exercises": [
                    {
                        "movementId": to_global_id("Movement", self.test_movement.id),
                        "standardSets": [
                            {"sequenceNumber": 1, "completedReps": 4, "weight": 135},
                            {"sequenceNumber": 2, "completedReps": 4, "weight": 135},
                            {"sequenceNumber": 3, "completedReps": 4, "weight": 135},
                        ],
                    },
                    {
                        "movementId": to_global_id("Movement", self.test_movement2.id),
                        "nonStandardSets": {
                            "setType": "Drop Set",
                            "associatedSets": [
                                {"sequenceNumber": 1, "completedReps": 4, "weight": 135},
                                {"sequenceNumber": 2, "completedReps": 4, "weight": 115},
                                {"sequenceNumber": 3, "completedReps": 4, "weight": 105},
                            ],
                        },
                    },
                ],
            },
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertIsNotNone(content["data"]["workoutCreateCompleted"]["workout"])
        self.assertEqual(0, len(content["data"]["workoutCreateCompleted"]["errors"]))
        created_workout = Workout.objects.filter(notes="Mutation Test Note 2").first()
        self.assertIsNotNone(created_workout, "Expected a workout to be created")
        self.assertEqual(created_workout.template_id, self.test_workout2.id)
