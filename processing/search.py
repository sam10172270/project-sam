import sys
import json

query = " ".join(sys.argv[1:]).lower()

with open("log.jsonl", "r") as f:
    entries = [json.loads(line) for line in f]

results = [e for e in entries if query in e["text"].lower()]

if results:
    for r in results:
        print(f"[{r['timestamp']}] {r['text']}")
else:
    print("No matches found.")