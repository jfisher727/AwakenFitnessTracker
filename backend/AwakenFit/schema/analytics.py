from graphene import ObjectType, Field, String, Int

from AwakenFit.domains import analytics as AnalyticsDomain


class WeekInReview(ObjectType):
    total_workouts = Int()
    total_volume = String()
    top_muscle_group = String()
    total_cardio = String()
    favorite_equipment = String()
    message = String()


class Query(ObjectType):
    week_in_review = Field(WeekInReview)

    def resolve_week_in_review(parent, info):
        return AnalyticsDomain.calculate_week_summary(info.context.user.id)
