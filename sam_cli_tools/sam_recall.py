import os
import json
import sys

keyword = sys.argv[1] if len(sys.argv) > 1 else ""
base_path = "./jsonMemory"

for root, dirs, files in os.walk(base_path):
    for file in files:
        if file.endswith(".json"):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                try:
                    data = json.load(f)
                    for line in json.dumps(data, indent=2).split("\n"):
                        if keyword.lower() in line.lower():
                            print(f"{file} -> {line.strip()}")
                except:
                    pass