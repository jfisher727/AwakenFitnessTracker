from graphene import Mutation, Node, InputObjectType, Field, List, DateTime, String

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from ..models import Workout

from ..domains import UserDomain, WorkoutDomain, MutationDomain

from .exercise import ExerciseCreateTemplateInput, ExerciseCreateCompletedInput
from .message import MessageNode


class WorkoutNode(DjangoObjectType):
    class Meta:
        model = Workout
        interfaces = (Node,)
        description = ""
        filter_fields = {
            "id": ["exact"],
        }
        fields = (
            "id",
            "start_time",
            "stop_time",
            "template",
            "notes",
        )


class WorkoutCreateTemplateInput(InputObjectType):
    notes = String(required=False)
    exercies = List(ExerciseCreateTemplateInput, required=True)


class WorkoutCreateCompletedInput(InputObjectType):
    exercies = List(ExerciseCreateCompletedInput, required=True)
    start_time = DateTime(required=True)
    stop_time = DateTime(required=True)
    notes = String(required=False)


class WorkoutCreateTemplate(Mutation):
    class Arguments:
        input = WorkoutCreateTemplateInput(required=True)

    workout = Field(WorkoutNode)
    errors = List(MessageNode)

    @classmethod
    def mutate(cls, root, info, input: WorkoutCreateTemplateInput):
        workout = None
        user = None
        errors = list()

        if not info.context.user.is_authenticated:
            errors.append(MessageNode(message=UserDomain.authenticated_action_error))
        else:
            user = info.context.user

        errors.append(MutationDomain.validate_workout_input(input))

        if len(errors) == 0:
            workout = WorkoutDomain.create_workout(
                user.id,
            )

        return WorkoutCreateTemplate(workout=workout, errors=errors)


class Query(object):
    workout = Node.Field(WorkoutNode)
    workouts = DjangoFilterConnectionField(WorkoutNode)


class Mutation(object):
    workout_create_template = WorkoutCreateTemplate.Field()
