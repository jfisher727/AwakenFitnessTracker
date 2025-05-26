from django.conf import settings

from openai import OpenAI

from AwakenFit.domains import chat_log as ChatLogDomain


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
        # user goals should be in the format of:
        # I want to <lose weight, gain muscle, workout more, etc>. I can workout <number of times per week>.
        # (optional) I have <dumbbells, barbell, ect> available to me.
        pass

    def evaluate_past_workouts():
        pass
