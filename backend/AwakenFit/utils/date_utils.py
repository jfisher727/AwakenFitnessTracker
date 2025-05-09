from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import pytz


def convert_date_to_datetime(date_obj: datetime.date, timezone: pytz.tzinfo) -> datetime:
    try:
        datetime_obj = datetime.combine(
            date_obj, datetime.min.time(), tzinfo=timezone
        )  # Combine date with midnight time
        return datetime_obj
    except pytz.exceptions.UnknownTimeZoneError:
        print(f"Error: Timezone '{timezone}' is not recognized.")
        return None


def get_current_week_date_range(date_input: datetime):
    start_of_week = date_input - timedelta(days=date_input.weekday())  # Monday
    start_date_formatted = convert_date_to_datetime(start_of_week.date(), date_input.tzinfo)
    end_of_week = start_of_week + timedelta(days=6)  # Sunday
    end_date_formatted = convert_date_to_datetime(end_of_week.date(), date_input.tzinfo)
    return start_date_formatted, end_date_formatted
