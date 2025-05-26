from pathlib import Path
import json

import pandas as pd

from rapidfuzz import fuzz, process

from AwakenFit.models import Movement

CURRENT_FILE_PATH = Path(__file__).resolve()
MOVEMENT_CSV = CURRENT_FILE_PATH.parent.parent / "fixtures" / "movements.csv"
MOVEMENT_EXPORT = CURRENT_FILE_PATH.parent.parent / "fixtures" / "movement_export.json"


# Function to check for duplicates
def is_duplicate(new_name, existing_names, threshold=85):
    # Use RapidFuzz to find the best match in the existing names
    try:
        match, score, _ = process.extractOne(new_name, existing_names, scorer=fuzz.ratio)
    except:
        print("new name!")
        return False, None, None
    return score >= threshold, match, score


def import_movements():
    movement_data = pd.read_csv(MOVEMENT_CSV, index_col=0)

    existing_movements = list(Movement.objects.values_list("name", flat=True))

    new_movements = list()
    for _, row in movement_data.iterrows():

        new_name = row["Title"]

        # skip the holman exercises
        if (
            "holman" in new_name.lower()
            or "30" in new_name
            or "gethin" in new_name.lower()
            or "hm" in new_name.lower()
            or "fyr" in new_name.lower()
            or "am" in new_name.lower()
            or "bfr" in new_name.lower()
            or "up" in new_name.lower()
            or "tbs" in new_name.lower()
            or "meta" in new_name.lower()
        ):
            print(f"skpping {new_name}")
            continue

        if "-" == new_name[-1]:
            new_name = new_name[:-1]

        is_dupe, match, score = is_duplicate(new_name, existing_movements)

        if is_dupe:
            if score == 100:
                print(f"skpping {new_name}")
                continue
            action = input(f"'{new_name}' is similar to '{match}' (Score: {score}). Add anyway? [y/n]: ")
            if action.lower() == "n":
                continue

        existing_movements.append(new_name)

        equipment = row["Equipment"]
        if not any(equipment in entry for entry in Movement.EQUIPMENT_CHOICES):
            if isinstance(equipment, str):
                match equipment.lower():
                    case _ if "e-z" in equipment.lower():
                        equipment = Movement.EZ_CURL_BAR
                    case _ if "kettle" in equipment.lower():
                        equipment = Movement.KETTLEBELL
                    case _ if "band" in equipment.lower():
                        equipment = Movement.RESISTENCE_BANDS
                    case _:
                        print("Couldn't correct equipment: %s" % equipment)
                        continue
            else:
                continue
        print("creating new movement")
        new_movements.append(
            Movement(
                name=row["Title"],
                description=row["Desc"],
                primary_muscle_group=row["BodyPart"],
                equipment_type=equipment,
            )
        )

    Movement.objects.bulk_create(new_movements)


def fix_ids():
    with open(MOVEMENT_EXPORT.resolve(), "r") as json_file:
        data = json.load(json_file)

    counter = 1
    for entry in data:
        entry["pk"] = counter
        counter += 1
        print(entry)

    with open(MOVEMENT_EXPORT.resolve(), "w") as json_file:
        json.dump(data, json_file, indent=4)
