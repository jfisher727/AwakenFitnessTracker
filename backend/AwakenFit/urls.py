from django.urls import path

from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from graphene_django.views import GraphQLView

from .schema import schema

app_name = "awakenFit"
urlpatterns = [
    # path("api/graphql", csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
    path("api/graphql", csrf_exempt(login_required(GraphQLView.as_view(graphiql=True, schema=schema)))),
]
