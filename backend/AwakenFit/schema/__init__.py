from graphene import ObjectType
from graphene import Schema

from .movement import Query as MovementQuery
from .workout import Query as WorkoutQuery
from .exercise import Query as ExerciseQuery
from .set import Query as SetQuery


class Query(MovementQuery, WorkoutQuery, ExerciseQuery, SetQuery, ObjectType):
    pass


schema = Schema(query=Query)
