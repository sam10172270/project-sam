import os
import json

base_path = "./jsonMemory"

for root, dirs, files in os.walk(base_path):
    for file in files:
        if file.endswith(".json"):
            path = os.path.join(root, file)
            with open(path, "r") as f:
                try:
                    data = json.load(f)
                    date = data.get("date", "N/A")
                    mood = data.get("mood", "N/A")
                    energy = data.get("energy", "N/A")
                    print(f"{date} | Mood: {mood} | Energy: {energy} | File: {file}")
                except:
                    pass