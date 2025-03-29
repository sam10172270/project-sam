#!/bin/bash

# Define the log type and log title
LOG_TYPE="$1"  # e.g., "mood", "work"
LOG_KEY="$2"   # e.g., "Ravi's Mood Log"

# Check if the type and key are provided
if [ -z "$LOG_TYPE" ] || [ -z "$LOG_KEY" ]; then
  echo "Usage: ./log-go-and-search.sh <log_type> <log_title>"
  exit 1
fi

# Create the log file
LOG_DATE=$(date +%F)
FILENAME="${LOG_KEY// /_}.json"
FILE_PATH="System/Logs/$LOG_TYPE/$FILENAME"

# Create the log content (You can customize this as needed)
cat <<EOF > "$FILE_PATH"
{
    "date": "$LOG_DATE",
    "log_type": "$LOG_TYPE",
    "tags": ["$LOG_KEY"],
    "file_path": "$FILE_PATH"
}
EOF

# Add log metadata to log-index.json
python3 -c "
import json

# File paths
index_file = 'log-index.json'

# Load existing index or create a new one
try:
    with open(index_file, 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    data = {'logs': []}

# Metadata for the new log
metadata = {
    'type': '$LOG_TYPE',
    'tags': ['$LOG_KEY'],
    'date': '$LOG_DATE',
    'file_path': '$FILE_PATH'
}

# Append the metadata
data['logs'].append(metadata)

# Write back to index file
with open(index_file, 'w') as f:
    json.dump(data, f, indent=4)
"

# Commit the log and push to GitHub
git add "$FILE_PATH"
git commit -m "log: auto-push ($FILENAME)"
git push origin logs-staging

# Search for the log
python3 -c "
import json

def search_logs(query):
    with open('log-index.json', 'r') as f:
        data = json.load(f)
    results = [log for log in data['logs'] if query.lower() in [tag.lower() for tag in log['tags']]]
    return results

# Run the search with the log title as the query
logs = search_logs('$LOG_KEY')
if logs:
    print('Found logs:')
    for log in logs:
        print(log['file_path'])
else:
    print('No logs found for query:', '$LOG_KEY')
"
