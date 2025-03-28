import json
import sys

filename = sys.argv[1]
tag = sys.argv[2]
path = f"./jsonMemory/{filename}"

with open(path, "r") as f:
    data = json.load(f)

if "tags" not in data:
    data["tags"] = []

if tag not in data["tags"]:
    data["tags"].append(tag)

with open(path, "w") as f:
    json.dump(data, f, indent=2)

print(f"Tag '{tag}' added to {filename}")