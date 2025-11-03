from graphql_relay import from_global_id

from graphene import Mutation, Node, ObjectType, InputObjectType, Field, List, ID, String, Int, Date, Boolean

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from AwakenFit.models import ActiveWorkoutPlan, WorkoutDay, WorkoutPlan

from AwakenFit.domains import active_workout_plan as ActiveWorkoutPlanDomain
from AwakenFit.domains import workout_plan as WorkoutPlanDomain
from AwakenFit.domains import workout_day as WorkoutDayDomain
from AwakenFit.domains import user as UserDomain
from AwakenFit.domains import mutation as MutationDomain

from .message import MessageNode


class WorkoutDayNode(DjangoObjectType):
    class Meta:
        model = WorkoutDay
        interfaces = (Node,)
        description = ""
        fields = ("id", "workout_one", "workout_two", "workout_three", "sequence_number", "day_number", "rest_day")


class WorkoutPlanNode(DjangoObjectType):
    class Meta:
        model = WorkoutPlan
        interfaces = (Node,)
        description = ""
        convert_choices_to_enum = False
        filter_fields = {
            "id": ["exact"],
            "name": ["exact", "icontains", "istartswith"],
            "plan_type": ["exact", "icontains"],
        }
        fields = ("id", "name", "plan_type", "block_size")

    workout_days = List(WorkoutDayNode)

    @classmethod
    def get_queryset(cls, queryset, info):
        return WorkoutPlanDomain.filter_queryset_by_user(queryset, info.context.user)

    def resolve_workout_days(self, info):
        return WorkoutDayDomain.get_by_plan_id(self.id)


class ActiveWorkoutPlanNode(DjangoObjectType):
    class Meta:
        model = ActiveWorkoutPlan
        interfaces = (Node,)
        description = ""
        fields = ("id", "plan", "day", "start_date")

    @classmethod
    def get_queryset(cls, queryset, info):
        return ActiveWorkoutPlanDomain.filter_queryset_by_user(queryset, info.context.user)


class WorkoutDayInput(InputObjectType):
    workout_one_id = ID(required=False)
    workout_two_id = ID(required=False)
    workout_three_id = ID(required=False)
    sequence_number = Int(required=True)
    day_number = Int(required=True)
    rest_day = Boolean(required=True)


class WorkoutPlanInput(InputObjectType):
    name = String(required=True)
    type = String(required=True)
    days = List(WorkoutDayInput, required=True)


class WorkoutPlanCreate(Mutation):
    class Arguments:
        input = WorkoutPlanInput(required=True)

    plan = Field(WorkoutPlanNode)
    errors = List(MessageNode)

    @classmethod
    def mutate(cls, root, info, input: WorkoutPlanInput):
        plan = None
        user = None
        errors = list()

        if not info.context.user.is_authenticated:
            errors.append(MessageNode(message=UserDomain.ERROR_MESSAGES.get("UNAUTHENTICATED")))
        else:
            user = info.context.user

        validation_errors = MutationDomain.validate_workout_plan_input(input, user)
        for entry in validation_errors:
            errors.append(MessageNode(message=entry))

        if not errors:
            plan = WorkoutPlanDomain.create_workout_plan(user.id, input.name, input.type)
            for entry in input.days:
                WorkoutDayDomain.create_update_workout_day(
                    plan.id,
                    entry.sequence_number,
                    entry.day_number,
                    int(from_global_id(entry.workout_one_id).id) if entry.workout_one_id else None,
                    int(from_global_id(entry.workout_two_id).id) if entry.workout_two_id else None,
                    int(from_global_id(entry.workout_three_id).id) if entry.workout_three_id else None,
                    entry.rest_day,
                )

        return WorkoutPlanCreate(plan=plan, errors=errors)


class ActiveWorkoutPlanInput(InputObjectType):
    plan_id = ID(required=True)
    start_date = Date(required=True)


class ActiveWorkoutPlanCreate(Mutation):
    class Arguments:
        input = ActiveWorkoutPlanInput(required=True)

    plan = Field(WorkoutPlanNode)
    errors = List(MessageNode)

    @classmethod
    def mutate(cls, root, info, input: ActiveWorkoutPlanInput):
        plan = None
        user = None
        errors = list()

        if not info.context.user.is_authenticated:
            errors.append(MessageNode(message=UserDomain.ERROR_MESSAGES.get("UNAUTHENTICATED")))
        else:
            user = info.context.user

        validation_errors = MutationDomain.validate_active_workout_plan_input(input.plan_id, input.start_date)
        for entry in validation_errors:
            errors.append(MessageNode(message=entry))

        if not errors:
            active_plan = ActiveWorkoutPlanDomain.start_new_workout_plan(
                user.id, from_global_id(input.plan_id).id, input.start_date
            )
            plan = active_plan.plan

        return ActiveWorkoutPlanCreate(plan=plan, errors=errors)


class Query(ObjectType):
    workout_plan = Node.Field(WorkoutPlanNode)
    workout_plans = DjangoFilterConnectionField(WorkoutPlanNode)
    active_workout_plan = Field(ActiveWorkoutPlanNode)

    def resolve_active_workout_plan(root, info):
        return ActiveWorkoutPlanDomain.get_by_user_id(info.context.user.id)


class Mutation(ObjectType):
    workout_plan_create = WorkoutPlanCreate.Field()
    active_workout_plan_create = ActiveWorkoutPlanCreate.Field()
