from graphene import Node, ObjectType, Mutation, Field, List, InputObjectType, String, ID
from graphql_relay import from_global_id

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from AwakenFit.models import Movement

from AwakenFit.domains import user as UserDomain
from AwakenFit.domains import movement as MovementDomain
from AwakenFit.domains import mutation as MutationDomain

from .message import MessageNode


class MovementNode(DjangoObjectType):
    class Meta:
        model = Movement
        interfaces = (Node,)
        description = ""
        convert_choices_to_enum = False
        filter_fields = {
            "id": ["exact"],
            "name": ["exact", "icontains", "istartswith"],
            "primary_muscle_group": ["exact"],
            "equipment_type": ["exact"],
            "movement_type": ["exact"],
        }
        fields = (
            "id",
            "name",
            "description",
            "primary_muscle_group",
            "secondary_muscle_group",
            "equipment_type",
            "movement_type",
        )

    @classmethod
    def get_queryset(cls, queryset, info):
        return queryset.order_by("name")


class MovementCreateInput(InputObjectType):
    name = String(required=True)
    description = String(required=True)
    primary_muscle_group = String(required=True)
    secondary_muscle_group = String(required=True)
    equipment_type = String(required=True)
    movement_type = String(required=True)


class MovementEditInput(InputObjectType):
    id = ID(required=True)
    description = String(required=False)
    primary_muscle_group = String(required=True)
    secondary_muscle_group = String(required=True)
    equipment_type = String(required=True)
    movement_type = String(required=True)


class MovementCreate(Mutation):
    class Arguments:
        input = MovementCreateInput(required=True)

    movement = Field(MovementNode)
    errors = List(MessageNode)

    @classmethod
    def mutate(cls, root, info, input: MovementCreateInput):
        movement = None
        user = None
        errors = list()

        if not info.context.user.is_authenticated:
            errors.append(MessageNode(message=UserDomain.ERROR_MESSAGES["UNAUTHENTICATED"]))
        else:
            user = info.context.user

        if not user or not user.is_superuser:
            # user does not have permission to create a movement
            errors.append(MessageNode(message=UserDomain.ERROR_MESSAGES["MISSING_PERMISSIONS"]))

        errors.extend(MutationDomain.validate_movement_create_input(input))

        if not errors:
            movement = MovementDomain.create_movement(
                input.name,
                input.description,
                input.primary_muscle_group,
                input.secondary_muscle_group,
                input.equipment_type,
                input.movement_type,
            )

        return MovementCreate(movement=movement, errors=errors)


class MovementEdit(Mutation):
    class Arguments:
        input = MovementEditInput(required=True)

    movement = Field(MovementNode)
    errors = List(MessageNode)

    @classmethod
    def mutate(cls, root, info, input: MovementEditInput):
        movement = None
        user = None
        errors = list()

        if not info.context.user.is_authenticated:
            errors.append(MessageNode(message=UserDomain.ERROR_MESSAGES.get("UNAUTHENTICATED")))
        else:
            user = info.context.user

        if not user or not user.is_superuser:
            # user does not have permission to create a movement
            errors.append(MessageNode(message=UserDomain.ERROR_MESSAGES.get("MISSING_PERMISSIONS")))

        validation_errors = MutationDomain.validate_movement_edit_input(input)
        for entry in validation_errors:
            errors.append(MessageNode(message=entry))

        if not errors:
            movement = MovementDomain.edit_movement(
                from_global_id(input.id).id,
                input.primary_muscle_group,
                input.secondary_muscle_group,
                input.equipment_type,
                input.movement_type,
                description=input.description,
            )

        return MovementCreate(movement=movement, errors=errors)


class Query(ObjectType):
    movement = Node.Field(MovementNode)
    movements = DjangoFilterConnectionField(MovementNode)


class Mutation(ObjectType):
    movement_create = MovementCreate.Field()
    movement_edit = MovementEdit.Field()
