from graphql_relay import from_global_id

from graphene import Mutation, Node, ObjectType, InputObjectType, Field, List, DateTime, String, ID

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from django.utils import timezone

from AwakenFit.models import Workout

from AwakenFit.domains import user as UserDomain
from AwakenFit.domains import workout as WorkoutDomain
from AwakenFit.domains import exercise as ExerciseDomain
from AwakenFit.domains import set as SetDomain
from AwakenFit.domains import mutation as MutationDomain

from AwakenFit.filters import WorkoutFilter

from .exercise import ExerciseNode, ExerciseCreateTemplateInput, ExerciseCreateCompletedInput
from .message import MessageNode


class WorkoutNode(DjangoObjectType):
    class Meta:
        model = Workout
        interfaces = (Node,)
        description = "This object describes a user workout, either completed or template"
        filterset_class = WorkoutFilter
        fields = (
            "id",
            "start_time",
            "stop_time",
            "template",
            "name",
            "notes",
        )

    exercises = List(ExerciseNode)

    @classmethod
    def get_queryset(cls, queryset, info):
        return WorkoutDomain.filter_queryset_by_user(queryset, info.context.user)

    def resolve_exercises(self, info):
        return ExerciseDomain.get_by_workout_id(self.id)


class WorkoutCreateTemplateInput(InputObjectType):
    name = String(required=True)
    notes = String(required=False)
    exercises = List(ExerciseCreateTemplateInput, required=True)


class WorkoutCreateCompletedInput(InputObjectType):
    exercises = List(ExerciseCreateCompletedInput, required=True)
    start_time = DateTime(required=True)
    stop_time = DateTime(required=True)
    template_id = ID(required=False)
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
        user_id = None
        errors = list()

        if not info.context.user.is_authenticated:
            errors.append(MessageNode(message=UserDomain.ERROR_MESSAGES.get("UNAUTHENTICATED")))
        else:
            user = info.context.user
            user_id = user.id

        validation_errors = MutationDomain.validate_workout_template_input(user_id, input)
        for entry in validation_errors:
            errors.append(MessageNode(message=entry))

        if not errors:
            workout = WorkoutDomain.create_workout(
                user.id,
                timezone.now(),
                timezone.now(),
                True,
                input.notes,
                name=input.name,
            )
            for entry in input.exercises:
                created_exercise = ExerciseDomain.create_exercise(
                    from_global_id(entry.movement_id).id,
                    workout.id,
                    entry.intensity if entry.intensity is not None else 0,
                    entry.notes if entry.notes is not None else "",
                )

                if entry.standard_sets:
                    for standard_set in entry.standard_sets:
                        SetDomain.create_template_set(
                            created_exercise.id,
                            standard_set.sequence_number,
                            standard_set.min_reps if standard_set.min_reps is not None else 0,
                            standard_set.max_reps if standard_set.max_reps is not None else 0,
                            standard_set.duration if standard_set.duration is not None else "",
                        )
                if entry.non_standard_sets:
                    for non_standard_set in entry.non_standard_sets:
                        parent_set = SetDomain.create_parent_non_standard_set(
                            created_exercise.id, non_standard_set.set_type
                        )
                        for associated_set in non_standard_set.associated_sets:
                            SetDomain.create_template_set(
                                created_exercise.id,
                                associated_set.sequence_number,
                                associated_set.min_reps if associated_set.min_reps is not None else 0,
                                associated_set.max_reps if associated_set.max_reps is not None else 0,
                                associated_set.duration if associated_set.duration is not None else "",
                                parent_set=parent_set,
                            )

        return WorkoutCreateTemplate(workout=workout, errors=errors)


class WorkoutCreateCompleted(Mutation):
    class Arguments:
        input = WorkoutCreateCompletedInput(required=True)

    workout = Field(WorkoutNode)
    errors = List(MessageNode)

    @classmethod
    def mutate(cls, root, info, input: WorkoutCreateCompletedInput):
        workout = None
        user = None
        errors = list()

        if not info.context.user.is_authenticated:
            errors.append(MessageNode(message=UserDomain.ERROR_MESSAGES["UNAUTHENTICATED"]))
        else:
            user = info.context.user

        errors.extend(MutationDomain.validate_workout_completed_input(input))

        if not errors:
            template_id = None
            if input.template_id is not None:
                template_id = from_global_id(input.template_id).id

            workout = WorkoutDomain.create_workout(
                user.id,
                input.start_time,
                input.stop_time,
                False,
                input.notes,
                template_id=template_id,
            )
            for entry in input.exercises:
                created_exercise = ExerciseDomain.create_exercise(
                    from_global_id(entry.movement_id).id,
                    workout.id,
                    entry.intensity if entry.intensity is not None else 0,
                    entry.notes if entry.notes is not None else "",
                )

                if entry.standard_sets:
                    for standard_set in entry.standard_sets:
                        SetDomain.create_completed_set(
                            created_exercise.id,
                            standard_set.sequence_number,
                            standard_set.completed_reps if standard_set.completed_reps is not None else 0,
                            standard_set.weight if standard_set.weight is not None else 0,
                            standard_set.duration if standard_set.duration is not None else "",
                            standard_set.equipment_identifier if standard_set.equipment_identifier is not None else "",
                        )
                if entry.non_standard_sets:
                    for non_standard_set in entry.non_standard_sets:
                        parent_set = SetDomain.create_parent_non_standard_set(
                            created_exercise.id, non_standard_set.set_type
                        )
                        for associated_set in non_standard_set.associated_sets:
                            SetDomain.create_completed_set(
                                created_exercise.id,
                                associated_set.sequence_number,
                                associated_set.completed_reps if associated_set.completed_reps is not None else 0,
                                associated_set.weight if associated_set.weight is not None else 0,
                                associated_set.duration if associated_set.duration is not None else "",
                                (
                                    associated_set.equipment_identifier
                                    if associated_set.equipment_identifier is not None
                                    else ""
                                ),
                                parent_set=parent_set,
                            )

        return WorkoutCreateCompleted(workout=workout, errors=errors)


class Query(ObjectType):
    workout = Node.Field(WorkoutNode)
    workouts = DjangoFilterConnectionField(WorkoutNode)


class Mutation(ObjectType):
    workout_create_template = WorkoutCreateTemplate.Field()
    workout_create_completed = WorkoutCreateCompleted.Field()
