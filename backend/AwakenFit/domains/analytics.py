from datetime import datetime, timedelta
import pytz

import pandas as pd

from AwakenFit.domains import workout as WorkoutDomain

from AwakenFit.utils import date_utils


def format_timedelta(timedelta: timedelta):
    total_duration = []

    total_seconds = int(timedelta.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)

    if seconds > 30:
        minutes += 1

    if hours > 0:
        total_duration.append("{:02d}".format(hours))
        if hours > 1:
            total_duration.append("hours")
        else:
            total_duration.append("hour")

    total_duration.append("{:02d}".format(minutes))
    if minutes > 1:
        total_duration.append("minutes")
    else:
        total_duration.append("minute")

    return " ".join(total_duration)


def calculate_week_summary(user_id: int):
    current_week = datetime.now(pytz.timezone("America/New_York"))
    start_date, end_date = date_utils.get_current_week_date_range(current_week)
    workouts = WorkoutDomain.get_by_user_date_range(user_id, start_date, end_date)

    if not workouts:
        return {
            "total_workouts": 0,
            "total_volume": "",
            "top_muscle_group": "",
            "total_cardio": "N/A",
            "favorite_equipment": "",
            "total_workout_duration": "",
            "message": "No workouts recorded for this week",
        }

    sets = list()
    duration = 0
    for entry in workouts:
        diff = entry.stop_time - entry.start_time
        duration += diff.seconds
        for exercise in entry.exercises.all():
            for set in exercise.sets.all():
                sets.append(
                    {
                        "date": entry.start_time,
                        "muscle_group": exercise.movement.primary_muscle_group,
                        "type": exercise.movement.movement_type,
                        "equipment": exercise.movement.equipment_type,
                        "reps": set.completed_reps or 0,
                        "weight": set.weight or 0,
                        "duration": set.duration or "",
                    }
                )

    dataframe = pd.DataFrame(sets)

    dataframe["volume"] = dataframe["weight"] * dataframe["reps"]
    total_volume = dataframe["volume"].sum()

    dataframe["duration"] = pd.to_timedelta(dataframe["duration"])
    total_cardio = dataframe["duration"].sum()

    volume_by_group = dataframe.groupby("muscle_group")["volume"].sum().sort_values(ascending=False)
    top_muscle_group = volume_by_group.idxmax()

    equipment_counts = dataframe.value_counts("equipment")

    total_workout_duration = timedelta(seconds=duration)

    return {
        "total_workouts": len(workouts),
        "total_volume": str(total_volume),
        "top_muscle_group": top_muscle_group,
        "total_cardio": format_timedelta(total_cardio),
        "favorite_equipment": equipment_counts.idxmax(),
        "total_workout_duration": format_timedelta(total_workout_duration),
        "message": "N/A",
    }
