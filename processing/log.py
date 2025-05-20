import sys
import json
from datetime import datetime

# Get the text from command-line argument
text = " ".join(sys.argv[1:])

# Create the log entry
entry = {
    "timestamp": datetime.utcnow().isoformat(),
    "text": text.strip()
}

# Save to a log file (append mode)
with open("log.jsonl", "a") as f:
    f.write(json.dumps(entry) + "\n")

# Optional: print confirmation
print("Logged:", entry)