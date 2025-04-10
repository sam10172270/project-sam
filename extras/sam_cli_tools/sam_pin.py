import sys
import json

filename = sys.argv[1]
pin_file = "./jsonMemory/pinned.json"

try:
    with open(pin_file, "r") as f:
        pins = json.load(f)
except:
    pins = []

if filename not in pins:
    pins.append(filename)

with open(pin_file, "w") as f:
    json.dump(pins, f, indent=2)

print(f"Pinned: {filename}")