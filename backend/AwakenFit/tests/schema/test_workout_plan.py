import json
from datetime import datetime, date
from datetime import timedelta

from graphql_relay import to_global_id, from_global_id

from graphene_django.utils.testing import GraphQLTestCase

from django.contrib.auth.models import User
from django.utils import timezone

from AwakenFit.models import Movement, Workout, Exercise, Set, WorkoutPlan, WorkoutDay, ActiveWorkoutPlan


class WorkoutPlanSchemaTest(GraphQLTestCase):
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
        self.test_exercise = Exercise.objects.create(
            movement=self.test_movement, workout=self.test_workout, intensity=1, notes="Test Exercise notes"
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

        self.test_plan = WorkoutPlan.objects.create(user=self.test_user, name="Test Workout Plan", plan_type="Ongoing")
        self.test_day1 = WorkoutDay.objects.create(plan=self.test_plan, workout_one=self.test_workout)
        self.active_workout_plan = ActiveWorkoutPlan.objects.create(
            user=self.test_user, plan=self.test_plan, day=self.test_day1
        )

        self.test_plan2 = WorkoutPlan.objects.create(
            user=self.test_user, name="Second Workout Plan", plan_type="Ongoing"
        )
        self.test_day2 = WorkoutDay.objects.create(plan=self.test_plan2, workout_one=self.test_workout)

        self.workout_plan_create_mutation = """
            mutation workoutPlanCreate(
                $name: String!,
                $type: String!,
                $days:[WorkoutDayInput]!
            ) {
                workoutPlanCreate(input: {name: $name,
                                          type: $type,
                                          days: $days}) {
                    plan {
                        id
                        name
                    }
                    errors {
                        message
                    }
                }
            }
        """

        self.active_workout_plan_create_mutation = """
            mutation activeWorkoutPlanCreate($planId: ID!, $startDate: Date!) {
                activeWorkoutPlanCreate(input: {planId: $planId,
                                                startDate: $startDate}) {
                    plan {
                        id
                        name
                    }
                    errors {
                        message
                    }
                }
            }
        """

    def test_individual_workout_plan_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query workoutPlan($id: ID!) {
                workoutPlan(id: $id) {
                    id
                    name
                    planType
                    blockSize
                }
            }
            """,
            operation_name="workoutPlan",
            variables={"id": to_global_id("WorkoutPlanNode", self.test_plan.id)},
        )

        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertIsNotNone(content["data"])
        self.assertEqual(self.test_plan.name, content["data"]["workoutPlan"]["name"])

    def test_workout_plan_list_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query workoutPlans {
                workoutPlans {
                    edges {
                        node {
                        id
                        name
                        planType
                        blockSize
                        }
                    }
                }
            }
            """,
            operation_name="workoutPlans",
        )

        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(WorkoutPlan.objects.all().count(), len(content["data"]["workoutPlans"]["edges"]))

    def test_active_workout_plan_query(self):
        self.client.login(username="testuser1", password="testpassword1")
        response = self.query(
            """
            query activeWorkoutPlan {
                activeWorkoutPlan {
                    id
                    plan {
                        id
                        name
                    }
                    day {
                        id
                    }
                    startDate
                }
            }
            """,
            operation_name="activeWorkoutPlan",
        )

        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(
            self.test_plan.id,
            int(from_global_id(content["data"]["activeWorkoutPlan"]["id"]).id),
            "Did not get the expected record back",
        )
        self.assertEqual(
            self.test_day1.id,
            int(from_global_id(content["data"]["activeWorkoutPlan"]["day"]["id"]).id),
            "Did not get the expected record back",
        )
        self.assertIsNotNone(content["data"]["activeWorkoutPlan"]["startDate"], "start date should have been populated")

    def test_workout_plan_create_mutation(self):
        self.assertFalse(
            WorkoutPlan.objects.filter(name="New Workout Plan").exists(), "The workout plan name should not exist"
        )

        self.client.login(username="testuser1", password="testpassword1")

        response = self.query(
            self.workout_plan_create_mutation,
            operation_name="workoutPlanCreate",
            variables={
                "name": "New Workout Plan",
                "type": "Ongoing",
                "days": [
                    {
                        "workoutOneId": to_global_id("Workout", self.test_workout.id),
                        "sequenceNumber": 1,
                        "dayNumber": 1,
                        "restDay": False,
                    },
                    {
                        "sequenceNumber": 2,
                        "dayNumber": 2,
                        "restDay": True,
                    },
                    {
                        "workoutOneId": to_global_id("Workout", self.test_workout.id),
                        "sequenceNumber": 3,
                        "dayNumber": 3,
                        "restDay": False,
                    },
                ],
            },
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertIsNotNone(content["data"]["workoutPlanCreate"]["plan"], "A workout plan should have been returned")
        self.assertEqual(0, len(content["data"]["workoutPlanCreate"]["errors"]), "No errors should have been returned")
        self.assertTrue(
            WorkoutPlan.objects.filter(name="New Workout Plan").exists(), "A new workout plan should have been created"
        )

        stored_days = WorkoutDay.objects.filter(
            plan__id=from_global_id(content["data"]["workoutPlanCreate"]["plan"]["id"]).id
        )
        self.assertEqual(
            3,
            stored_days.count(),
            "The expected number of WorkoutDay records was not created",
        )
        self.assertEqual(1, stored_days.filter(rest_day=True).count(), "One rest day should have been created")
        self.assertEqual(2, stored_days.filter(rest_day=False).count(), "Two active days should have been created")

    def test_active_workout_plan_create_mutation(self):
        self.client.login(username="testuser1", password="testpassword1")

        previous_record = ActiveWorkoutPlan.objects.filter(user=self.test_user).first()
        self.assertEqual(previous_record.plan, self.test_plan, "The pre-condition was not met")

        response = self.query(
            self.active_workout_plan_create_mutation,
            operation_name="activeWorkoutPlanCreate",
            variables={
                "planId": to_global_id("WorkoutPlan", self.test_plan2.id),
                "startDate": date.today().isoformat(),
            },
        )

        content = json.loads(response.content)

        self.assertResponseNoErrors(response)
        self.assertIsNotNone(content["data"]["activeWorkoutPlanCreate"], "Should have received a plan back")
        self.assertIsNotNone(content["data"]["activeWorkoutPlanCreate"]["plan"], "Should have received a plan back")
        self.assertEqual(0, len(content["data"]["activeWorkoutPlanCreate"]["errors"]))
        self.assertTrue(
            ActiveWorkoutPlan.objects.filter(user=self.test_user, plan=self.test_plan2).exists(),
            "The active workout plan was not updated as expected",
        )
        self.assertEqual(
            1,
            ActiveWorkoutPlan.objects.filter(user=self.test_user).count(),
            "Should not have more than one active plan per user.",
        )
