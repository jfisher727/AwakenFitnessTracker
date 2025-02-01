from django.conf import settings

from openai import OpenAI

from ..domains import ChatLogDomain


class ChatGPTDomain(object):
    # need to make sure the role types are converted if necessary based on LLM
    # define the LLM version as an attribute of the class

    DEVELOPER_MESSAGE = (
        "You are a professional personal trainer. "
        "You will provide the user with guidance on building workout plans and "
        "provide insights into completed workouts. Response with structured JSON only."
    )

    def __init__(self, user):
        self.chatgpt = OpenAI(api_key=settings.CHATGPT_API_KEY)
        self.user = user

    def generate_workout_template(user_goals):
        pass

    def evaluate_past_workouts():
        pass
