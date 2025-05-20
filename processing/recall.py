import sys
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Load model once
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load all logs
with open("log.jsonl", "r") as f:
    logs = [json.loads(line) for line in f]

texts = [log["text"] for log in logs]

# Embed all log texts
embeddings = model.encode(texts)

# Build FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings))

# Get query from command line
query = " ".join(sys.argv[1:])

# Embed the query
query_vector = model.encode([query])

# Search top 3 similar thoughts
D, I = index.search(np.array(query_vector), k=3)

# Show results
print("\nTop matches:\n")
for i in I[0]:
    print(f"[{logs[i]['timestamp']}] {logs[i]['text']}")