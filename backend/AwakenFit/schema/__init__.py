from graphene import ObjectType
from graphene import Schema

from .set import Query as SetQuery
from .movement import Query as MovementQuery
from .workout import Query as WorkoutQuery
from .exercise import Query as ExerciseQuery

from .workout import Mutation as WorkoutMutation


class Query(MovementQuery, WorkoutQuery, ExerciseQuery, SetQuery, ObjectType):
    pass


class Mutation(WorkoutMutation, ObjectType):
    pass


schema = Schema(query=Query, mutation=Mutation)
