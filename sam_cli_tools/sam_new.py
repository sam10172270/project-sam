import sys
import json
import os
from datetime import datetime

entry_type = sys.argv[1] if len(sys.argv) > 1 else "note"
base_path = "./jsonMemory"
now = datetime.now()
date_str = now.strftime("%Y-%m-%d")
timestamp = now.strftime("%Y-%m-%d-%H%M")

template = {
    "emotional_log": {
        "date": date_str,
        "type": "emotional_log",
        "tags": [],
        "summary": "",
        "rituals": {
            "dump": "",
            "anchor": "",
            "connection": ""
        }
    },
    "task": {
        "date": date_str,
        "type": "execution_plan",
        "phase": "",
        "goal": "",
        "checklist": []
    },
    "conversation": {
        "date": date_str,
        "type": "key_conversation",
        "participants": [],
        "insight": "",
        "emotions": []
    },
    "note": {
        "date": date_str,
        "type": "note",
        "title": "",
        "content": ""
    }
}

filename = f"{base_path}/{entry_type}s/{timestamp}-{entry_type}.json"
os.makedirs(os.path.dirname(filename), exist_ok=True)

with open(filename, "w") as f:
    json.dump(template.get(entry_type, template["note"]), f, indent=2)

print(f"New {entry_type} created: {filename}")