from django.urls import path

from django.views.decorators.csrf import csrf_exempt

from graphene_django.views import GraphQLView

from . import views

from .schema import schema

app_name = "awakenFit"
urlpatterns = [
    path("api/graphql", csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
]
