from typing import Optional

from django.db.models import Q

from ..models import Movement


class MovementDomain(object):
    MAX_NAME_LENGTH = 250
    MAX_DESCRIPTION_LENGTH = 495
    ERROR_MESSAGES = {"INVALID_ID": "The ID provided is not a valid movement"}

    @staticmethod
    def get_by_id(id: int) -> Movement:
        return Movement.objects.get(pk=id)

    @staticmethod
    def get_by_id_set(id_set: list[int]) -> list[Movement]:
        return Movement.objects.filter(id__in=id_set).all()

    @staticmethod
    def get_by_name(name: str) -> list[Movement]:
        return Movement.objects.filter(name__icontains=name).all()

    @staticmethod
    def get_by_muscle_group(muscle_group: str) -> list[Movement]:
        return Movement.objects.filter(
            Q(primary_muscle_group=muscle_group) | Q(secondary_muscle_group=muscle_group)
        ).all()

    @staticmethod
    def get_by_equipment_type(equipment: str) -> list[Movement]:
        return Movement.objects.filter(equipment_type=equipment).all()

    @staticmethod
    def get_by_movement_type(movement: str) -> list[Movement]:
        return Movement.objects.filter(movement_type=movement).all()

    @staticmethod
    def is_valid_id(id: int) -> bool:
        return Movement.objects.filter(id=id).exists()

    @staticmethod
    def create_movement(
        name: str,
        description: str,
        primary_muscle_group: str,
        secondary_muscle_group: str,
        equipment: str,
        movement_type: str,
    ) -> Optional[Movement]:
        created_record = None
        valid_input = True

        if not any(primary_muscle_group in values for values in Movement.MUSCLE_CHOICES):
            valid_input = False
        if not any(secondary_muscle_group in values for values in Movement.MUSCLE_CHOICES):
            valid_input = False
        if not any(equipment in values for values in Movement.EQUIPMENT_CHOICES):
            valid_input = False
        if not any(movement_type in values for values in Movement.MOVEMENT_TYPE_CHOICES):
            valid_input = False
        if len(name) > MovementDomain.MAX_NAME_LENGTH:
            name = name[: MovementDomain.MAX_NAME_LENGTH]
        if len(description) > MovementDomain.MAX_DESCRIPTION_LENGTH:
            description = description[: MovementDomain.MAX_DESCRIPTION_LENGTH]

        if valid_input:
            created_record = Movement.objects.create(
                name=name,
                description=description,
                primary_muscle_group=primary_muscle_group,
                secondary_muscle_group=secondary_muscle_group,
                equipment_type=equipment,
                movement_type=movement_type,
            )

        return created_record
