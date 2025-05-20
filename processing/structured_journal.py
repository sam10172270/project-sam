import sys
import json
from datetime import datetime

# Use the raw input from command-line and parse using separator tokens
# Example: python3 structured_journal.py "mood:focused" "energy:high" "wins:Published 2 shorts;Finalized pricing" ...
args = sys.argv[1:]

entry = {
    "date": datetime.utcnow().strftime("%Y-%m-%d"),
    "mood": "",
    "energy": "",
    "wins": [],
    "project_work": [],
    "key_decisions": [],
    "insights": [],
    "notes": ""
}

for arg in args:
    if ":" not in arg:
        continue
    key, value = arg.split(":", 1)
    key = key.strip().lower()
    value = value.strip()

    if key in ["wins", "project_work", "key_decisions", "insights"]:
        entry[key] = [v.strip() for v in value.split(";") if v.strip()]
    elif key in ["mood", "energy", "notes"]:
        entry[key] = value

# Save to file
with open("journal.jsonl", "a") as f:
    f.write(json.dumps(entry, ensure_ascii=False) + "\n")

print("Logged structured journal entry:", entry)
