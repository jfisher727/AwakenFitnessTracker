from graphene import ObjectType
from graphene import Schema

from .analytics import Query as AnalyticsQuery
from .set import Query as SetQuery
from .movement import Query as MovementQuery
from .workout import Query as WorkoutQuery
from .exercise import Query as ExerciseQuery
from .user import Query as UserQuery

from .workout import Mutation as WorkoutMutation
from .movement import Mutation as MovementMutation


class Query(AnalyticsQuery, MovementQuery, WorkoutQuery, ExerciseQuery, SetQuery, UserQuery, ObjectType):
    pass


class Mutation(WorkoutMutation, MovementMutation, ObjectType):
    pass


schema = Schema(query=Query, mutation=Mutation)
